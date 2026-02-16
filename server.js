import mysql from 'mysql';
import config from './config.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

// API Routes

// Route to get deals valid for current day
app.get('/api/todaydeals', (req, res) => {
    const connection = mysql.createConnection(config)

    const sql = `
        SELECT 
            d.deal_id, 
            d.restaurant_id, 
            d.deal_name, 
            d.description, 
            d.deal_price, 
            d.edited_at, 
            r.restaurant_name, 
            dh.day_of_week, 
            dh.start_time, 
            dh.end_time
        FROM deals d
        RIGHT JOIN deal_hours dh ON d.deal_id = dh.deal_id
        JOIN restaurants r ON r.restaurant_id = d.restaurant_id
        WHERE dh.day_of_week = DAYNAME(NOW())
        AND (dh.start_date <= DATE(NOW()) OR dh.start_date IS NULL)
        AND (dh.end_date >= DATE(NOW()) OR dh.end_date IS NULL)
    `

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database error:', error.message);
            return res.status(500).json({ error: 'Failed to fetch promotions'});
        }

        const todayDeals = results.map(deal => ({
            dealID: deal.deal_id,
            restaurantID: deal.restaurant_id,
            restaurantName: deal.restaurant_name,
            dealName: deal.deal_name,
            dealDescription: deal.description,
            dealPrice: deal.deal_price,
            dealEditData: deal.edited_at,
            dayOfWeek: deal.day_of_week,
            dealStartTime: deal.start_time,
            dealEndTime: deal.end_time
        }));

        console.log(todayDeals)
        res.json(todayDeals);
    });

    connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
