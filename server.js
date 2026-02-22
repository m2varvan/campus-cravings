import mysql from "mysql";
import config from "./config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

// API Routes

// Route to get deals valid for current day
app.get("/api/todaydeals", (req, res) => {
  const connection = mysql.createConnection(config);

  const sql = `
        SELECT 
            d.deal_id, 
            d.restaurant_id, 
            d.deal_name, 
            d.description, 
            d.deal_price, 
            DATE_FORMAT(d.edited_at, '%Y-%m-%d %H:%i') AS edited_at_formatted,
            r.restaurant_name, 
            GROUP_CONCAT(TIME_FORMAT(dh.start_time, '%H:%i')) AS start_times,
            GROUP_CONCAT(TIME_FORMAT(dh.end_time, '%H:%i')) AS end_times,
            AVG(rt.taste_score) AS avg_taste_rating,
            AVG(rt.value_score) AS avg_value_rating,
            AVG(rt.portion_score) AS avg_portion_rating,
            COUNT(rt.rating_id) AS number_of_ratings
        FROM deals d
        RIGHT JOIN deal_hours dh ON d.deal_id = dh.deal_id
        JOIN restaurants r ON r.restaurant_id = d.restaurant_id
        LEFT JOIN ratings rt ON rt.deal_id = d.deal_id
        WHERE dh.day_of_week = DAYNAME(NOW())
        AND (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
        AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
        GROUP BY d.deal_id;
    `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to fetch promotions" });
    }

    const todayDeals = results.map((deal) => ({
      dealID: deal.deal_id,
      restaurantID: deal.restaurant_id,
      restaurantName: deal.restaurant_name,
      dealName: deal.deal_name,
      dealDescription: deal.description || "n/a",
      dealPrice: deal.deal_price.toFixed(2),
      dealEditData: deal.edited_at_formatted,
      dayOfWeek: deal.day_of_week,
      dealStartTime: deal.start_times ? deal.start_times.split(",") : [],
      dealEndTime: deal.end_times ? deal.end_times.split(",") : [],
      dealValueRating: deal.avg_value_rating
        ? deal.avg_value_rating.toFixed(1)
        : 0,
      dealTasteRating: deal.avg_taste_rating
        ? deal.avg_taste_rating.toFixed(1)
        : 0,
      dealPortionRating: deal.avg_portion_rating
        ? deal.avg_portion_rating.toFixed(1)
        : 0,
      numRatings: deal.number_or_ratings || 0,
    }));

    res.json(todayDeals);
  });

  connection.end();
});

// API to get the deal availability for a specific deal
app.post("/api/dealhours", (req, res) => {
  const connection = mysql.createConnection(config);
  const { dealID } = req.body;

  const sql = `
        SELECT 
            deal_id, 
            day_of_week, 
            GROUP_CONCAT(TIME_FORMAT(start_time, '%H:%i') ORDER BY start_time) AS start_times,
            GROUP_CONCAT(TIME_FORMAT(end_time, '%H:%i') ORDER BY end_time) AS end_times
        FROM deal_hours
        WHERE (start_date <= DATE(NOW()) OR start_date IS NULL)
        AND (end_date >= DATE(NOW()) OR end_date IS NULL)
        AND deal_id = ?
        GROUP BY deal_id, day_of_week
        ORDER BY 
            deal_id,
            FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
        ;`;

  // Connnect to SQL Database and insert review. Handle any errors.
  connection.query(sql, [dealID], (error, result) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to load hours" });
    }

    const dealHours = result.map((day) => ({
      dealID: day.deal_id,
      dayOfWeek: day.day_of_week,
      dealStartTime: day.start_times ? day.start_times.split(",") : [],
      dealEndTime: day.end_times ? day.end_times.split(",") : [],
    }));

    // Return hours
    res.json(dealHours);
  });

  connection.end();
});

// API endpoint to get all restaurant info
app.get("/api/get-restaurants", (req, res) => {
  const connection = mysql.createConnection(config);

  const user_query = `
        SELECT * FROM restaurants
           
    `;

  connection.query(user_query, (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to fetch restaurants" });
    }
    res.json(results);
  });
});

// Route to get all valid deals
app.get("/api/weekdeals", (req, res) => {
  const connection = mysql.createConnection(config);

  const sql = `
        SELECT 
            d.deal_id, 
            d.restaurant_id, 
            d.deal_name, 
            d.description, 
            d.deal_price, 
            DATE_FORMAT(d.edited_at, '%Y-%m-%d %H:%i') AS edited_at_formatted, 
            r.restaurant_name, 
            dh.day_of_week,
            GROUP_CONCAT(dh.start_time) AS start_times,
            GROUP_CONCAT(dh.end_time) AS end_times,
            AVG(rt.taste_score) AS avg_taste_rating,
            AVG(rt.value_score) AS avg_value_rating,
            AVG(rt.portion_score) AS avg_portion_rating,
            COUNT(rt.rating_id) AS number_of_ratings
        FROM deals d
        RIGHT JOIN deal_hours dh ON d.deal_id = dh.deal_id
        JOIN restaurants r ON r.restaurant_id = d.restaurant_id
        LEFT JOIN ratings rt ON rt.deal_id = d.deal_id
        WHERE (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
        AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
        GROUP BY d.deal_id, dh.day_of_week;
    `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to fetch promotions" });
    }

    // Create object to sort deals by day of week
    const dealsByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    // Iterate through results and append to correct day of week array.
    results.map((deal) => {
      dealsByDay[deal.day_of_week].push({
        dealID: deal.deal_id,
        restaurantID: deal.restaurant_id,
        restaurantName: deal.restaurant_name,
        dealName: deal.deal_name,
        dealDescription: deal.description || "n/a",
        dealPrice: deal.deal_price.toFixed(2),
        dealEditData: deal.edited_at_formatted,
        dayOfWeek: deal.day_of_week,
        dealStartTime: deal.start_times ? deal.start_times.split(",") : [],
        dealEndTime: deal.end_times ? deal.end_times.split(",") : [],
        dealValueRating: deal.avg_value_rating
          ? deal.avg_value_rating.toFixed(1)
          : 0,
        dealTasteRating: deal.avg_taste_rating
          ? deal.avg_taste_rating.toFixed(1)
          : 0,
        dealPortionRating: deal.avg_portion_rating
          ? deal.avg_portion_rating.toFixed(1)
          : 0,
        numRatings: deal.number_or_ratings || 0,
      });
    });

    res.json(dealsByDay);
  });

  connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
