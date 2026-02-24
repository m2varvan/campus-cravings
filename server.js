import mysql from 'mysql';
import config from './config.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { createConnection } from 'net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

// API Routes

// Route to get deals valid for current day
app.get("/api/today/deals", (req, res) => {
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
        ? parseFloat(parseFloat(deal.avg_value_rating).toFixed(1))
        : 0,
      dealTasteRating: deal.avg_taste_rating
        ? parseFloat(parseFloat(deal.avg_taste_rating).toFixed(1))
        : 0,
      dealPortionRating: deal.avg_portion_rating
        ? parseFloat(parseFloat(deal.avg_portion_rating).toFixed(1))
        : 0,
      numRatings: deal.number_of_ratings
        ? parseInt(deal.number_of_ratings, 10)
        : 0,
    }));

    res.json(todayDeals);
  });

  connection.end();
});

// API to get the deal availability for a specific deal
app.post("/api/deal/hours", (req, res) => {
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

// API to get the deal availability all deals in a restaurant
app.post("/api/deal-availability-by-restaurant", (req, res) => {
  const connection = mysql.createConnection(config);
  const { restaurant_id } = req.body;

  const sql = `
          SELECT 
          dh.deal_id,
          dh.day_of_week,
          GROUP_CONCAT(TIME_FORMAT(dh.start_time, '%H:%i') ORDER BY dh.start_time) AS start_times,
          GROUP_CONCAT(TIME_FORMAT(dh.end_time, '%H:%i') ORDER BY dh.end_time) AS end_times
          FROM deal_hours dh
          JOIN deals d ON dh.deal_id = d.deal_id
          WHERE d.restaurant_id = ?
          AND (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
          AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
          GROUP BY dh.deal_id, dh.day_of_week
          ORDER BY 
          dh.deal_id,
          FIELD(dh.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');`;

  connection.query(sql, [restaurant_id], (error, result) => {
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

  connection.connect((err) => {
    if (err) {
      console.error("Connection error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }

    const user_query = `SELECT * FROM restaurants`;

    connection.query(user_query, (error, results) => {
      if (error) {
        console.error("Database error:", error.message);
        connection.end();
        return res.status(500).json({ error: "Failed to fetch restaurants" });
      }

      res.json(results);
      connection.end();
    });
  });
});

// API to get the opening hours for a specific restaurant
app.post("/api/restaurant-hours", (req, res) => {
  const connection = mysql.createConnection(config);
  const { restaurantID } = req.body;

  const sql = `
    SELECT 
        restaurant_id, 
        day_of_week, 
        GROUP_CONCAT(TIME_FORMAT(start_time, '%H:%i') ORDER BY start_time) AS start_times,
        GROUP_CONCAT(TIME_FORMAT(end_time, '%H:%i') ORDER BY end_time) AS end_times
    FROM restaurant_hours
    WHERE restaurant_id = ?
    GROUP BY restaurant_id, day_of_week
    ORDER BY 
        FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
  `;

  connection.query(sql, [restaurantID], (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to load restaurant hours" });
    }

    const restaurantHours = results.map((day) => ({
      restaurantID: day.restaurant_id,
      dayOfWeek: day.day_of_week,
      startTimes: day.start_times ? day.start_times.split(",") : [],
      endTimes: day.end_times ? day.end_times.split(",") : [],
    }));

    res.json(restaurantHours);
  });
});

// API endpoint to get all deals from each restaurant
app.post("/api/get-deals-by-restaurant", (req, res) => {
  const connection = mysql.createConnection(config);

  const { restaurant_id } = req.body;

  connection.connect((err) => {
    if (err) {
      console.error("Connection error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }

    const user_query = `SELECT deal_name, description, deal_price FROM deals WHERE restaurant_id = ?`;

    connection.query(user_query, [restaurant_id], (error, results) => {
      if (error) {
        console.error("Database error:", error.message);
        connection.end();
        return res.status(500).json({ error: "Failed to fetch restaurants" });
      }

      res.json(results);
      connection.end();
    });
  });
});

// Route to get all valid deals
app.get("/api/week/deals", (req, res) => {
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
          ? parseFloat(parseFloat(deal.avg_value_rating).toFixed(1))
          : 0,
        dealTasteRating: deal.avg_taste_rating
          ? parseFloat(parseFloat(deal.avg_taste_rating).toFixed(1))
          : 0,
        dealPortionRating: deal.avg_portion_rating
          ? parseFloat(parseFloat(deal.avg_portion_rating).toFixed(1))
          : 0,
        numRatings: deal.number_of_ratings
          ? parseInt(deal.number_of_ratings, 10)
          : 0,
      });
    });

    res.json(dealsByDay);
  });

  connection.end();
});

// API to get a user's reviews for a deal
app.post("/api/user/rating", (req, res) => {
  const connection = mysql.createConnection(config);
  const { dealID, userID } = req.body;

  const sql = `
        SELECT 
            value_score, 
            taste_score, 
            portion_score, 
            DATE_FORMAT(r.updated_at, '%Y-%m-%d %H:%i') AS updated_at,
            rating_id
        FROM ratings r
        JOIN users u ON u.id = r.user_id
        JOIN deals d ON d.deal_id = r.deal_id
        WHERE r.deal_id = ?
        AND r.user_id = ?;
        `;

  const vals = [dealID, userID];

  // Connnect to SQL Database and insert review. Handle any errors.
  connection.query(sql, vals, (error, result) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to load ratings" });
    }

    const userReview = result.map((review) => ({
      tasteRating: parseFloat(review.taste_score),
      valueRating: parseFloat(review.value_score),
      portionRating: parseFloat(review.portion_score),
      ratingDate: review.updated_at,
      ratingID: parseInt(review.rating_id),
    }));

    // Return review
    res.json(userReview);
  });

  connection.end();
});

// API to add a new rating
app.post("/api/add/rating", (req, res) => {
  const connection = mysql.createConnection(config);
  const { dealID, userID, tasteRating, valueRating, portionRating } = req.body;

  const sql = `
        INSERT INTO ratings (deal_id, user_id, taste_score, value_score, portion_score)
        VALUES (?, ?, ?, ?, ?);
    `;

  const vals = [
    parseInt(dealID),
    userID,
    parseFloat(tasteRating),
    parseFloat(valueRating),
    parseFloat(portionRating),
  ];

  connection.query(sql, vals, (error, result) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to add rating" });
    }

    res.status(201).json({ message: "Rating added successfully" });
  });
  connection.end();
});

// API to edit a rating
app.post("/api/edit/rating", (req, res) => {
  const connection = mysql.createConnection(config);
  const { dealID, userID, tasteRating, valueRating, portionRating, ratingID } =
    req.body;

  const sql = `
        UPDATE ratings
        SET 
            taste_score = ?,
            value_score = ?,
            portion_score = ?,
            updated_at = NOW()
        WHERE deal_id = ? AND user_id = ? AND rating_id = ?;
    `;
  const vals = [
    parseFloat(tasteRating),
    parseFloat(valueRating),
    parseFloat(portionRating),
    parseInt(dealID),
    userID,
    parseInt(ratingID),
  ];

  // Connnect to SQL Database and delete
  connection.query(sql, vals, (error, result) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to edit rating" });
    }

    // Return status 201 to indicate success
    res.status(201).json();
  });

  connection.end();
});

app.post("/api/delete/rating", (req, res) => {
  const connection = mysql.createConnection(config);
  const { ratingID, dealID, userID } = req.body;

  const sql = `
        DELETE FROM ratings
        WHERE deal_id = ? AND user_id = ? AND rating_id = ?;
    `;
  const vals = [dealID, userID, ratingID];

  // Connnect to SQL Database and delete
  connection.query(sql, vals, (error, result) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to delete rating" });
    }

    // Return status 201 to indicate success
    res.status(201).json();
  });
  connection.end();
});

// API to get deal ratings
app.post("/api/deal/ratings", (req, res) => {
  const connection = mysql.createConnection(config);
  const { dealID } = req.body;

  const sql = `
    SELECT 
      AVG(value_score) AS avg_value_rating,
      AVG(taste_score) AS avg_taste_rating,
      AVG(portion_score) AS avg_portion_rating,
      COUNT(rating_id) AS num_ratings
    FROM ratings
    WHERE deal_id = ?;
  `;

  connection.query(sql, [dealID], (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to fetch deal ratings" });
    }

    const row = results[0];
    res.json({
      dealValueRating: row.avg_value_rating
        ? parseFloat(row.avg_value_rating)
        : 0,
      dealTasteRating: row.avg_taste_rating
        ? parseFloat(row.avg_taste_rating)
        : 0,
      dealPortionRating: row.avg_portion_rating
        ? parseFloat(row.avg_portion_rating)
        : 0,
      numRatings: row.num_ratings ? parseInt(row.num_ratings, 10) : 0,
    });
  });

  connection.end();
});

app.get('/api/deal/:dealID/reviews', (req, res) => {
  const { dealID } = req.params;
  const connection = mysql.createConnection(config);

  const sql = `
    SELECT 
      review_id,
      user_id,
      title,
      body,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at,
      DATE_FORMAT(edited_at, '%Y-%m-%d %H:%i') AS edited_at
    FROM reviews
    WHERE deal_id = ?
    ORDER BY created_at DESC
  `;

  connection.query(sql, [dealID], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }

    res.json(results);
  });

  connection.end();

});

app.post("/api/add/review", (req, res) => {
  const { dealID, userID, title, body } = req.body;

  if (!title?.trim() || !body?.trim()) {
    return res.status(400).json({ error: "Title and body required" });
  }

  if (title.length > 250 || body.length > 1000) {
    return res.status(400).json({ error: "Character limit exceeded" });
  }

  const sql = `
    INSERT INTO reviews (user_id, deal_id, title, body)
    VALUES (?, ?, ?, ?)
  `;

  const connection = mysql.createConnection(config); // <-- FIXED

  connection.query(sql, [userID, dealID, title, body], (err, result) => {
    
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add review" });
    }

    res.json({
      review_id: result.insertId,
      user_id: userID,
      title,
      body,
      created_at: new Date(),
      edited_at: null
    });
  });

  connection.end();


});

app.put('/api/review/:reviewID', (req, res) => {
  const { reviewID } = req.params;
  const { title, body } = req.body;

  if (!title?.trim() || !body?.trim()) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  if (title.length > 250 || body.length > 1000) {
    return res.status(400).json({ error: 'Character limit exceeded' });
  }

  const connection = mysql.createConnection(config);

  const sql = `
    UPDATE reviews
    SET title = ?, body = ?, edited_at = NOW()
    WHERE review_id = ?
  `;

  connection.query(sql, [title, body, reviewID], (err) => {
    

    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update review' });
    }

    res.json({ success: true });
  });

  connection.end();

});

app.delete('/api/review/:reviewID', (req, res) => {
  const { reviewID } = req.params;

  const connection = mysql.createConnection(config);

  const sql = `
    DELETE FROM reviews
    WHERE review_id = ?
  `;

  connection.query(sql, [reviewID], (err, result) => {
    

    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete review' });
    }

    res.json({ success: true });
  });

  connection.end();

});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version


app.post('/api/signup', (req, res) =>{
    const connection = mysql.createConnection(config);

    const{ id, username, firstName, lastName, profilePhoto} = req.body

    const checkQuery = "SELECT * FROM users WHERE username = ?";
    connection.query(checkQuery, [username], (err, data) => {
        if (err) {
            console.error("Select Error:", err)
            return res.status(500).json("User search failed");
        }

        if (data.length > 0) {
            return res.status(409).json("This email already has an account.");
        }
        const insertQuery = "INSERT INTO users (id, username, first_name, last_name, profile_photo) VALUES (?, ?, ?, ?, ?)";   
        const values = [id, username, firstName, lastName, profilePhoto];
        connection.query(insertQuery, values, (err, result) => {
            connection.end();
            if (err) {
                console.error("Select Error:", err)
                return res.status(500).json("User entry failed");
            } 
            return res.status(200).json("User has been created.")
        })   
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
