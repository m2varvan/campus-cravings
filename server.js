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
app.post("/api/today/deals", (req, res) => {
  const { userID } = req.body;

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
            COUNT(rt.rating_id) AS number_of_ratings,
            COALESCE(SUM(dv.vote), 0) AS total_votes,
            MAX(CASE WHEN dv.user_id = ? THEN dv.vote ELSE 0 END) AS user_vote,
            CASE 
                WHEN fd.deal_id IS NULL THEN 0
                ELSE 1
            END AS is_favourited
        FROM deals d
        RIGHT JOIN deal_hours dh 
            ON d.deal_id = dh.deal_id
        JOIN restaurants r 
            ON r.restaurant_id = d.restaurant_id
        LEFT JOIN ratings rt 
            ON rt.deal_id = d.deal_id
        LEFT JOIN deal_votes dv 
            ON dv.deal_id = d.deal_id
        LEFT JOIN favourite_deals fd 
            ON fd.deal_id = d.deal_id 
          AND fd.user_id = ?
        WHERE dh.day_of_week = DAYNAME(NOW())
        AND (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
        AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
        GROUP BY d.deal_id;
    `;

  connection.query(sql, [userID, userID], (error, results) => {
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
      totalVote: parseInt(deal.total_votes) || 0,
      userVote:
        parseInt(deal.user_vote) === 0
          ? null
          : parseInt(deal.user_vote) || null,
      fave: deal.is_favourited || 0,
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

// API endpoint to get all restaurant info
app.post("/api/get-restaurants", (req, res) => {
  const connection = mysql.createConnection(config);
  const { userID } = req.body;

  connection.connect((err) => {
    if (err) {
      console.error("Connection error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }

    const user_query = ` 
      SELECT 
          r.*,
          (fr.restaurant_id IS NOT NULL) AS is_favourited
      FROM restaurants r
      LEFT JOIN favourite_restaurants fr
          ON fr.restaurant_id = r.restaurant_id
        AND fr.user_id = ?`;

    connection.query(user_query, [userID], (error, results) => {
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

// API to get the avg rating for a restaurant's deals
app.post("/api/restaurant-rating", (req, res) => {
  const connection = mysql.createConnection(config);
  const { restaurant_id, getAll } = req.body;

  const sql = getAll
    ? `
      SELECT 
      res.restaurant_id, 
      AVG(rat.value_score) AS avg_value_rating, 
      AVG(rat.taste_score) AS avg_taste_rating, 
      AVG(rat.portion_score) AS avg_portion_rating, 
      COUNT(rat.rating_id) AS total_ratings
      FROM restaurants res
      LEFT JOIN deals d ON res.restaurant_id = d.restaurant_id
      LEFT JOIN ratings rat ON d.deal_id = rat.deal_id
      GROUP BY res.restaurant_id;
    `
    : `
    SELECT
      d.restaurant_id,
      AVG(r.value_score) AS avg_value_rating,
      AVG(r.taste_score) AS avg_taste_rating,
      AVG(r.portion_score) AS avg_portion_rating,
      COUNT(r.rating_id) AS total_ratings
    FROM deals d
    LEFT JOIN ratings r ON d.deal_id = r.deal_id
    WHERE d.restaurant_id = ?
    GROUP BY d.restaurant_id;
  `;

  connection.query(sql, [restaurant_id], (error, result) => {
    if (error) {
      console.error("Database error:", error.message);
      connection.end();
      return res.status(500).json({ error: "Failed to load ratings" });
    }

    if (result.length === 0) {
      // No ratings found for this restaurant
      connection.end();
      return res.json({
        avg_value_score: 0,
        avg_taste_score: 0,
        avg_portion_score: 0,
        total_ratings: 0,
      });
    }

    const ratingData = !getAll ? result[0] : result;
    connection.end();
    if (!getAll) {
      return res.json({
        restaurant_id: Number(ratingData.restaurant_id) || null,
        avg_value_rating: Number(ratingData.avg_value_rating) || 0,
        avg_taste_rating: Number(ratingData.avg_taste_rating) || 0,
        avg_portion_rating: Number(ratingData.avg_portion_rating) || 0,
        total_ratings: Number(ratingData.total_ratings) || 0,
      });
    }

    const sanitizedData = ratingData.map((item) => ({
      restaurant_id: Number(item.restaurant_id),
      avg_value_rating: Number(item.avg_value_rating) || 0,
      avg_taste_rating: Number(item.avg_taste_rating) || 0,
      avg_portion_rating: Number(item.avg_portion_rating) || 0,
      total_ratings: Number(item.total_ratings) || 0,
    }));

    return res.json(sanitizedData);
  });
});

// API to get the opening hours for a specific restaurant
app.post("/api/restaurant-hours", (req, res) => {
  const connection = mysql.createConnection(config);
  const { restaurant_id, getAll } = req.body;

  const sql = getAll
    ? `
    SELECT 
        restaurant_id, 
        day_of_week, 
        GROUP_CONCAT(TIME_FORMAT(start_time, '%H:%i') ORDER BY start_time) AS start_times,
        GROUP_CONCAT(TIME_FORMAT(end_time, '%H:%i') ORDER BY end_time) AS end_times
    FROM restaurant_hours
    GROUP BY restaurant_id, day_of_week
    ORDER BY 
        FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');`
    : `
    SELECT 
        restaurant_id, 
        day_of_week, 
        GROUP_CONCAT(TIME_FORMAT(start_time, '%H:%i') ORDER BY start_time) AS start_times,
        GROUP_CONCAT(TIME_FORMAT(end_time, '%H:%i') ORDER BY end_time) AS end_times
    FROM restaurant_hours
    WHERE restaurant_id = ?
    GROUP BY restaurant_id, day_of_week
    ORDER BY 
        FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');
  `;

  const params = getAll ? [] : [restaurant_id];

  connection.query(sql, params, (error, results) => {
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
app.post("/api/restaurant-deals", (req, res) => {
  const connection = mysql.createConnection(config);
  const { restaurant_id, userID } = req.body;

  const dealsQuery = `
    SELECT
        d.deal_id, 
        d.restaurant_id, 
        d.deal_name, 
        d.description, 
        d.deal_price,
        r.restaurant_name,
        DATE_FORMAT(d.edited_at, '%Y-%m-%d %H:%i') AS edited_at,
        GROUP_CONCAT(DISTINCT dh.day_of_week) AS days_of_week,
        AVG(rt.taste_score) AS avg_taste_rating,
        AVG(rt.value_score) AS avg_value_rating,
        AVG(rt.portion_score) AS avg_portion_rating,
        COUNT(DISTINCT rt.rating_id) AS number_of_ratings,
        COALESCE(SUM(dv.vote), 0) AS total_votes,
        MAX(CASE WHEN dv.user_id = ? THEN dv.vote ELSE 0 END) AS user_vote
    FROM deals d
    LEFT JOIN deal_hours dh ON d.deal_id = dh.deal_id
    LEFT JOIN ratings rt ON rt.deal_id = d.deal_id
    LEFT JOIN deal_votes dv ON dv.deal_id = d.deal_id
    JOIN restaurants r ON r.restaurant_id = d.restaurant_id
    WHERE (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
      AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
      AND d.restaurant_id = ?
    GROUP BY d.deal_id;
    `;

  connection.query(dealsQuery, [userID, restaurant_id], (err, results) => {
    connection.end();

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load deals" });
    }

    // Format results
    const formattedResults = results.map((deal) => ({
      dealID: deal.deal_id,
      restaurantID: deal.restaurant_id,
      restaurantName: deal.restaurant_name,
      dealName: deal.deal_name || "n/a",
      dealDescription: deal.description || "n/a",
      dealPrice: parseFloat(deal.deal_price).toFixed(2),
      dealEditDate: deal.edited_at,
      daysOfWeek: deal.days_of_week ? deal.days_of_week.split(",") : [],
      dealValueRating:
        deal.avg_value_rating !== null
          ? parseFloat(deal.avg_value_rating.toFixed(1))
          : 0,
      dealTasteRating: deal.avg_taste_rating
        ? parseFloat(deal.avg_taste_rating.toFixed(1))
        : 0,
      dealPortionRating: deal.avg_portion_rating
        ? parseFloat(deal.avg_portion_rating.toFixed(1))
        : 0,
      numRatings: deal.number_of_ratings ? parseInt(deal.number_of_ratings) : 0,
      totalVote: parseInt(deal.total_votes) || 0,
      userVote:
        parseInt(deal.user_vote) === 0
          ? null
          : parseInt(deal.user_vote) || null,
    }));

    res.json(formattedResults);
  });
});

// Route to get all valid deals
app.post("/api/week/deals", (req, res) => {
  const { userID } = req.body;
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
          COUNT(rt.rating_id) AS number_of_ratings,
          COALESCE(SUM(dv.vote), 0) AS total_votes,
          MAX(CASE WHEN dv.user_id = ? THEN dv.vote ELSE 0 END) AS user_vote,
          (fd.deal_id IS NOT NULL) AS is_favourited
      FROM deals d
      RIGHT JOIN deal_hours dh 
          ON d.deal_id = dh.deal_id
      JOIN restaurants r 
          ON r.restaurant_id = d.restaurant_id
      LEFT JOIN ratings rt 
          ON rt.deal_id = d.deal_id
      LEFT JOIN deal_votes dv 
          ON dv.deal_id = d.deal_id
      LEFT JOIN favourite_deals fd 
          ON fd.deal_id = d.deal_id 
        AND fd.user_id = ?
      WHERE (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
      AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
      GROUP BY d.deal_id, dh.day_of_week;
  `;

  connection.query(sql, [userID, userID], (error, results) => {
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
        totalVote: parseInt(deal.total_votes) || 0,
        userVote:
          parseInt(deal.user_vote) === 0
            ? null
            : parseInt(deal.user_vote) || null,
        fave: deal.is_favourited || 0,
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

app.get("/api/deal/:dealID/reviews", (req, res) => {
  const { dealID } = req.params;
  const connection = mysql.createConnection(config);
  const userID = req.query.userID;

  const sql = `
    SELECT 
      r.review_id,
      r.user_id,
      u.username,
      r.title,
      r.body,
      r.helpful_votes,
      DATE_FORMAT(r.created_at,'%Y-%m-%d %H:%i') AS created_at,
      DATE_FORMAT(r.edited_at,'%Y-%m-%d %H:%i') AS edited_at,

      EXISTS(
          SELECT 1
          FROM review_helpful_votes hv
          WHERE hv.review_id = r.review_id
          AND hv.user_id = ?
      ) AS user_voted

    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.deal_id = ?
    ORDER BY r.created_at DESC
  `;

  connection.query(sql, [userID, dealID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }

    res.json(results);
  });

  connection.end();
});

app.get("/api/restaurant/:restaurantID/reviews", (req, res) => {
  const { restaurantID } = req.params;
  const connection = mysql.createConnection(config);
  const userID = req.query.userID;

  const sql = `
    SELECT 
      r.review_id,
      r.user_id,
      u.username,
      r.title,
      r.body,
      d.deal_name,
      r.helpful_votes,
      DATE_FORMAT(r.created_at,'%Y-%m-%d %H:%i') AS created_at,
      DATE_FORMAT(r.edited_at,'%Y-%m-%d %H:%i') AS edited_at,

      EXISTS(
          SELECT 1
          FROM review_helpful_votes hv
          WHERE hv.review_id = r.review_id
          AND hv.user_id = ?
      ) AS user_voted

    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN deals d ON r.deal_id = d.deal_id
    WHERE d.restaurant_id = ?
    ORDER BY r.created_at DESC
  `;

  connection.query(sql, [userID, restaurantID], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to fetch restaurant reviews" });
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

  const insertSql = `
    INSERT INTO reviews (user_id, deal_id, title, body)
    VALUES (?, ?, ?, ?)
  `;

  const connection = mysql.createConnection(config);

  connection.query(insertSql, [userID, dealID, title, body], (err, result) => {
    if (err) {
      console.error(err);
      connection.end();
      return res.status(500).json({ error: "Failed to add review" });
    }

    const reviewId = result.insertId;

    // Fetch back with formatted timestamps
    const fetchSql = `
      SELECT 
        r.review_id,
        r.user_id,
        u.username,
        r.title,
        r.body,
        DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS created_at,
        DATE_FORMAT(r.edited_at, '%Y-%m-%d %H:%i') AS edited_at,
        r.helpful_votes
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.review_id = ?
    `;

    connection.query(fetchSql, [reviewId], (err2, rows) => {
      connection.end();

      if (err2) {
        console.error(err2);
        return res
          .status(500)
          .json({ error: "Failed to fetch inserted review" });
      }

      res.json(rows[0]);
    });
  });
});

app.put("/api/review/:reviewID", (req, res) => {
  const { reviewID } = req.params;
  const { title, body } = req.body;

  if (!title?.trim() || !body?.trim()) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  if (title.length > 250 || body.length > 1000) {
    return res.status(400).json({ error: "Character limit exceeded" });
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
      return res.status(500).json({ error: "Failed to update review" });
    }

    res.json({ success: true });
  });

  connection.end();
});

app.delete("/api/review/:reviewID", (req, res) => {
  const { reviewID } = req.params;

  const connection = mysql.createConnection(config);

  const sql = `
    DELETE FROM reviews
    WHERE review_id = ?
  `;

  connection.query(sql, [reviewID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete review" });
    }

    res.json({ success: true });
  });

  connection.end();
});

app.post("/api/signup", (req, res) => {
  const connection = mysql.createConnection(config);

  const { uid, email, username, firstName, lastName, userType, profilePhoto } = req.body;

  // Check if email or username already exists
  const checkQuery = "SELECT email_address, username FROM users WHERE email_address = ? OR username = ?";
  connection.query(checkQuery, [email, username], (err, data) => {
    if (err) {
      console.error("Select Error:", err);
      connection.end();
      return res.status(500).json("User search failed");
    }

    const emailExists = data.some((user) => user.email_address === email);
    if (emailExists) {
      connection.end();
      return res.status(409).json({
        field: "email",
        message: "This email already has an account",
      });
    }

    const usernameExists = data.some((user) => user.username === username);
    if (usernameExists) {
      connection.end();
      return res.status(409).json({
        field: "username",
        message: "This username is already taken.",
      });
    }

    //  Insert user into the database, defaulting user_type to 'Regular'
    const insertQuery =
      `INSERT INTO users 
      (id, email_address, first_name, last_name, profile_photo, username, user_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [uid, email, firstName, lastName, profilePhoto, username, userType];

    connection.query(insertQuery, values, (err, result) => {
      connection.end();
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json("User entry failed");
      }
      return res.status(200).json({ message: "User has been created." });
    });
  });
});

app.get("/api/user/:uid", (req, res) => {
  const connection = mysql.createConnection(config);
  const { uid } = req.params;

  const query = "SELECT profile_photo FROM users WHERE id = ?";
  connection.query(query, [uid], (err, data) => {
    connection.end();
    if (err) {
      console.error("Select Error:", err);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ profilePhoto: data[0].profile_photo });
  });
});

app.get("/api/user/type/:uid", (req, res) => {
  const connection = mysql.createConnection(config);
  const { uid } = req.params;

  const query = "SELECT user_type FROM users WHERE id = ?";
  connection.query(query, [uid], (err, data) => {
    connection.end();
    if (err) {
      console.error("Select Error:", err);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ userType: data[0].user_type });
  });
});

app.post("/api/restaurant-info", (req, res) => {
  const connection = mysql.createConnection(config);
  const { restaurant_id } = req.body;

  const detailsQuery = `
    SELECT 
      city,
      closing_time,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') AS updated_at,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at,
      phone_number,
      cuisine,
      postal_code,
      province,
      restaurant_id,
      restaurant_name,
      street_address, 
      unit,
      website_url
    FROM restaurants 
    WHERE restaurant_id = ?;
  `;

  connection.query(detailsQuery, [restaurant_id], (err, results) => {
    connection.end();

    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to load restaurant details" });
    }

    res.json(results[0] || null);
  });
});

app.post("/api/vote", (req, res) => {
  const connection = mysql.createConnection(config);
  const { userID, dealID, vote, update } = req.body;
  const voteValue = Number(vote);

  if (!userID || !dealID || vote === undefined) {
    return res.status(400).send("Missing required fields");
  }

  if (![1, 0, -1].includes(voteValue)) {
    return res.status(400).send("Invalid vote value");
  }

  // prevent invalid insert
  if (!update && voteValue === 0) {
    return res.json({ success: true });
  }

  let sql;
  let params;

  if (update) {
    if (voteValue === 0) {
      sql = `
        DELETE FROM deal_votes
        WHERE user_id = ? AND deal_id = ?;
      `;
      params = [userID, dealID];
    } else {
      sql = `
        UPDATE deal_votes
        SET vote = ?
        WHERE user_id = ? AND deal_id = ?;
      `;
      params = [voteValue, userID, dealID];
    }
  } else {
    sql = `
      INSERT INTO deal_votes (user_id, deal_id, vote)
      VALUES (?, ?, ?);
    `;
    params = [userID, dealID, voteValue];
  }

  connection.query(sql, params, (err) => {
    connection.end();
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to submit vote" });
    }

    res.json({ success: true });
  });
});

app.post("/api/review/helpful", (req, res) => {

  const { reviewID, userID } = req.body;

  if (!userID) {
    return res.status(401).json({ error: "Must be logged in to vote helpful" });
  }

  const connection = mysql.createConnection(config);

  const checkVote = `
    SELECT id
    FROM review_helpful_votes
    WHERE review_id = ? AND user_id = ?
  `;

  connection.query(checkVote, [reviewID, userID], (err, results) => {

    if (err) {
      connection.end();
      return res.status(500).json({ error: "Database error" });
    }

    // USER ALREADY VOTED → REMOVE VOTE
    if (results.length > 0) {

      const deleteVote = `
        DELETE FROM review_helpful_votes
        WHERE review_id = ? AND user_id = ?
      `;

      connection.query(deleteVote, [reviewID, userID], (err) => {

        if (err) {
          connection.end();
          return res.status(500).json({ error: "Failed to remove vote" });
        }

        const decrement = `
          UPDATE reviews
          SET helpful_votes = helpful_votes - 1
          WHERE review_id = ?
        `;

        connection.query(decrement, [reviewID], (err) => {

          connection.end();

          if (err) {
            return res.status(500).json({ error: "Failed to update review" });
          }

          return res.json({ voted: false });

        });

      });

    }

    // USER HAS NOT VOTED → ADD VOTE
    else {

      const insertVote = `
        INSERT INTO review_helpful_votes (review_id, user_id)
        VALUES (?, ?)
      `;

      connection.query(insertVote, [reviewID, userID], (err) => {

        if (err) {
          connection.end();
          return res.status(500).json({ error: "Failed to insert vote" });
        }

        const increment = `
          UPDATE reviews
          SET helpful_votes = helpful_votes + 1
          WHERE review_id = ?
        `;

        connection.query(increment, [reviewID], (err) => {

          connection.end();

          if (err) {
            return res.status(500).json({ error: "Failed to update review" });
          }

          return res.json({ voted: true });

        });

      });

    }

  });

});

app.get("/api/review/:reviewID/helpful", async (req, res) => {
  const { reviewID } = req.params;

  try {
    const query = `
      SELECT helpful_votes
      FROM reviews
      WHERE review_id = ?
    `;

    const [result] = await db.query(query, [reviewID]);

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/save/fave/deal", (req, res) => {
  const { uuid, dealID } = req.body;
  const connection = mysql.createConnection(config);

  const sql = `
        INSERT INTO favourite_deals (user_id, deal_id)
        VALUES (?, ?)
    `;

  connection.query(sql, [uuid, dealID], (err, result) => {
    connection.end();
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save favourite deal" });
    }

    res.json({ success: true });
  });
});

app.post("/api/remove/fave/deal", (req, res) => {
  const { uuid, dealID } = req.body;
  const connection = mysql.createConnection(config);

  const sql = `
        DELETE FROM favourite_deals
        WHERE user_id = ? AND deal_id = ?
    `;

  connection.query(sql, [uuid, dealID], (err, result) => {
    connection.end();
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to remove favourite deal" });
    }

    res.json({ success: true });
  });
});

app.post("/api/save/fave/restaurant", (req, res) => {
  const { uuid, restaurantID } = req.body;
  const connection = mysql.createConnection(config);

  const sql = `
        INSERT INTO favourite_restaurants (user_id, restaurant_id)
        VALUES (?, ?)
    `;

  connection.query(sql, [uuid, restaurantID], (err, result) => {
    connection.end();
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to save favourite restaurant" });
    }

    res.json({ success: true });
  });
});

app.post("/api/remove/fave/restaurant", (req, res) => {
  const { uuid, restaurantID } = req.body;
  const connection = mysql.createConnection(config);

  const sql = `
        DELETE FROM favourite_restaurants
        WHERE user_id = ? AND restaurant_id = ?
    `;

  connection.query(sql, [uuid, restaurantID], (err, result) => {
    connection.end();
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to remove favourite restaurant" });
    }

    res.json({ success: true });
  });
});

app.post("/api/load/user", (req, res) => {
  const { uuid } = req.body;
  const connection = mysql.createConnection(config);

  const sql = `
      SELECT 
        id,
        first_name,
        last_name,
        email_address,
        username,
        profile_photo,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
      FROM users
      WHERE id = ?;
  `;

  connection.query(sql, [uuid], (err, result) => {
    connection.end();

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to load user info" });
    }

    const user = result[0];

    const userInfo = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email_address,
      userName: user.username,
      profilePhoto: user.profile_photo,
      createdDate: user.created_at,
    };

    res.json(userInfo);
  });
});

// Route to get a user's favourite deals
app.post("/api/load/fave/deal", (req, res) => {
  const { userID } = req.body;

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
      AVG(rt.taste_score) AS avg_taste_rating,
      AVG(rt.value_score) AS avg_value_rating,
      AVG(rt.portion_score) AS avg_portion_rating,
      COUNT(rt.rating_id) AS number_of_ratings,
      COALESCE(SUM(dv.vote), 0) AS total_votes,
      MAX(CASE WHEN dv.user_id = ? THEN dv.vote ELSE 0 END) AS user_vote,
      1 AS is_favourited
    FROM deals d
    JOIN favourite_deals fd ON fd.deal_id = d.deal_id AND fd.user_id = ?
    JOIN restaurants r ON r.restaurant_id = d.restaurant_id
    LEFT JOIN ratings rt ON rt.deal_id = d.deal_id
    LEFT JOIN deal_votes dv ON dv.deal_id = d.deal_id
    GROUP BY d.deal_id;
  `;

  connection.query(sql, [userID, userID], (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to fetch favourite deals" });
    }

    const faveDeals = results.map((deal) => ({
      dealID: deal.deal_id,
      restaurantID: deal.restaurant_id,
      restaurantName: deal.restaurant_name,
      dealName: deal.deal_name,
      dealDescription: deal.description || "n/a",
      dealPrice: deal.deal_price.toFixed(2),
      dealEditData: deal.edited_at_formatted,
      dealValueRating: deal.avg_value_rating
        ? parseFloat(deal.avg_value_rating.toFixed(1))
        : 0,
      dealTasteRating: deal.avg_taste_rating
        ? parseFloat(deal.avg_taste_rating.toFixed(1))
        : 0,
      dealPortionRating: deal.avg_portion_rating
        ? parseFloat(deal.avg_portion_rating.toFixed(1))
        : 0,
      numRatings: deal.number_of_ratings
        ? parseInt(deal.number_of_ratings, 10)
        : 0,
      totalVote: parseInt(deal.total_votes) || 0,
      userVote:
        parseInt(deal.user_vote) === 0
          ? null
          : parseInt(deal.user_vote) || null,
      fave: 1,
    }));

    res.json(faveDeals);
  });

  connection.end();
});

// API endpoint to get favourited restaurants with average rating and rating count
app.post("/api/load/fave/restaurants", (req, res) => {
  const connection = mysql.createConnection(config);
  const { uuid } = req.body;

  connection.connect((err) => {
    if (err) {
      console.error("Connection error:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }

    const query = `
      SELECT 
          r.*,
          1 as fave,
          ROUND(AVG((rt.taste_score + rt.portion_score + rt.value_score) / 3), 1) AS avg_rating,
          COUNT(rt.rating_id) AS num_ratings
      FROM restaurants r
      JOIN favourite_restaurants fr
          ON r.restaurant_id = fr.restaurant_id
      LEFT JOIN deals d
          ON d.restaurant_id = r.restaurant_id
      LEFT JOIN ratings rt
          ON rt.deal_id = d.deal_id
      WHERE fr.user_id = ?
      GROUP BY r.restaurant_id;
    `;

    connection.query(query, [uuid], (error, results) => {
      if (error) {
        console.error("Database error:", error.message);
        connection.end();
        return res
          .status(500)
          .json({ error: "Failed to fetch favourite restaurants" });
      }

      res.json(results);
      connection.end();
    });
  });
});

app.get('/api/signup/restaurants', (req, res) => {
    const connection = mysql.createConnection(config);

    connection.query("SELECT DISTINCT restaurant_name FROM restaurants", (err, data) => {
        connection.end();
        if (err) {
            console.error("Select Error:", err);
            return res.status(500).json({ message: "Failed to fetch restaurants" });
        }
        return res.status(200).json(data);
    });
});

app.get("/api/search", (req, res) => {
  const search = req.query.q;

  if (!search) {
    return res.json({ restaurants: [], deals: [] });
  }

  const restaurantQuery = `
    SELECT restaurant_id, restaurant_name
    FROM restaurants
    WHERE restaurant_name LIKE ?
  `;

  // Only return IDs (and restaurant name if needed). Full deal data is fetched individually later.
  const dealQuery = `
    SELECT d.deal_id, d.restaurant_id
    FROM deals d
    WHERE d.deal_name LIKE ?
  `;

  const db = mysql.createConnection(config);

  db.connect((err) => {
    if (err) {
      console.error("DB connection failed:", err);
      return res.status(500).send("Search failed");
    }

    db.query(restaurantQuery, [`%${search}%`], (err1, restaurants) => {
      if (err1) {
        console.error("Restaurant query error:", err1);
        db.end();
        return res.status(500).send("Search failed");
      }

      db.query(dealQuery, [`%${search}%`], (err2, deals) => {
        db.end();
        if (err2) {
          console.error("Deal query error:", err2);
          return res.status(500).send("Search failed");
        }

        res.json({ restaurants, deals });
      });
    });
  });
});

app.post("/api/user/rated/deals", (req, res) => {
  const { userID } = req.body;

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
        GROUP_CONCAT(DISTINCT TIME_FORMAT(dh.start_time, '%H:%i')) AS start_times,
        GROUP_CONCAT(DISTINCT TIME_FORMAT(dh.end_time, '%H:%i')) AS end_times,

        -- Ratings averages
        AVG(rt_all.taste_score) AS avg_taste_rating,
        AVG(rt_all.value_score) AS avg_value_rating,
        AVG(rt_all.portion_score) AS avg_portion_rating,
        COUNT(DISTINCT rt_all.rating_id) AS number_of_ratings,

        -- USER'S rating 
        rt_user.taste_score AS user_taste_rating,
        rt_user.value_score AS user_value_rating,
        rt_user.portion_score AS user_portion_rating,

        -- Votes
        COALESCE(SUM(dv.vote), 0) AS total_votes,
        MAX(CASE WHEN dv.user_id = ? THEN dv.vote ELSE 0 END) AS user_vote,

        -- Favourite
        CASE 
            WHEN fd.deal_id IS NULL THEN 0
            ELSE 1
        END AS is_favourited

    FROM ratings rt_user

    JOIN deals d 
        ON d.deal_id = rt_user.deal_id

    JOIN restaurants r 
        ON r.restaurant_id = d.restaurant_id

    LEFT JOIN deal_hours dh 
        ON d.deal_id = dh.deal_id

    LEFT JOIN ratings rt_all 
        ON rt_all.deal_id = d.deal_id

    LEFT JOIN deal_votes dv 
        ON dv.deal_id = d.deal_id

    LEFT JOIN favourite_deals fd 
        ON fd.deal_id = d.deal_id 
        AND fd.user_id = ?
    WHERE rt_user.user_id = ?
    GROUP BY d.deal_id;
  `;

  connection.query(sql, [userID, userID, userID], (error, results) => {
    if (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "Failed to fetch rated deals" });
    }

    const deals = results.map((deal) => ({
      dealID: deal.deal_id,
      restaurantID: deal.restaurant_id,
      restaurantName: deal.restaurant_name,
      dealName: deal.deal_name,
      dealDescription: deal.description || "n/a",
      dealPrice: deal.deal_price.toFixed(2),
      dealEditData: deal.edited_at_formatted,

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
      userTasteRating: parseFloat(deal.user_taste_rating).toFixed(1),
      userValueRating: parseFloat(deal.user_value_rating).toFixed(1),
      userPortionRating: parseFloat(deal.user_portion_rating).toFixed(1),

      totalVote: parseInt(deal.total_votes) || 0,
      userVote:
        parseInt(deal.user_vote) === 0
          ? null
          : parseInt(deal.user_vote) || null,

      fave: deal.is_favourited || 0,
    }));

    res.json(deals);
  });

  connection.end();
});

app.post("/api/user/reviews", (req, res) => {

  const { userID } = req.body;

  const connection = mysql.createConnection(config);

  const sql = `
    SELECT 
      r.review_id,
      r.user_id,
      u.username,
      r.title,
      r.body,
      d.deal_id,
      d.deal_name,
      d.restaurant_id,
      r.helpful_votes,

      DATE_FORMAT(r.created_at,'%Y-%m-%d %H:%i') AS created_at,
      DATE_FORMAT(r.edited_at,'%Y-%m-%d %H:%i') AS edited_at

    FROM reviews r
    JOIN users u 
      ON r.user_id = u.id

    JOIN deals d 
      ON r.deal_id = d.deal_id

    WHERE r.user_id = ?

    ORDER BY r.created_at DESC
  `;

  connection.query(sql, [userID], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to fetch user reviews" });
    }

    res.json(results);
  });

  connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
