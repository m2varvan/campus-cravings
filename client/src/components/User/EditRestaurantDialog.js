import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Alert, CircularProgress, Box, TextField, Typography
} from '@mui/material';

const EditRestaurantDialog = ({ open, handleClose, restaurant, onRestaurantUpdated }) => {
    const [values, setValues] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
        if (restaurant) {
            setValues({
                restaurantName: restaurant.restaurant_name || '',
                streetAddress: restaurant.street_address || '',
                unit: restaurant.unit || '',
                city: restaurant.city || '',
                province: restaurant.province || '',
                postalCode: restaurant.postal_code || '',
                phoneNumber: restaurant.phone_number || '',
                websiteUrl: restaurant.website_url || '',
                cuisine: restaurant.cuisine || '',
                openingTime: restaurant.opening_time || '',
                closingTime: restaurant.closing_time || '',
            });
            setErrors({});
            setSuccess(false);
        }
    }, [restaurant]);

    const handleChange = (key, value) => setValues(prev => ({ ...prev, [key]: value }));

    const field = (label, key, props = {}) => (
        <TextField
            label={label}
            fullWidth size="small"
            value={values[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            error={!!errors[key]}
            helperText={errors[key]}
            {...props}
        />
    );

    const validate = () => {
        const newErrors = {};

        if (!values.restaurantName?.trim()) newErrors.restaurantName = "Restaurant name is required";
        if (!values.streetAddress?.trim()) newErrors.streetAddress = "Street address is required";
        if (!values.city?.trim()) newErrors.city = "City is required";
        if (!values.province?.trim()) newErrors.province = "Province is required";
        if (!values.postalCode?.trim()) newErrors.postalCode = "Postal code is required";
        if (!values.openingTime) newErrors.openingTime = "Opening time is required";
        if (!values.closingTime) newErrors.closingTime = "Closing time is required";
        if (
            values.openingTime &&
            values.closingTime &&
            values.closingTime <= values.openingTime
        ) {
            newErrors.closingTime = "Closing time must be after opening time";
        }
        return newErrors;
    };

    const handleSave = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            const res = await fetch(`/api/owner/restaurants/${restaurant.restaurant_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            if (!res.ok) throw new Error();
            setSuccess(true);
            onRestaurantUpdated();
            setTimeout(handleClose, 2000);
        } catch {
            setErrors({ general: "Failed to update restaurant. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Restaurant Details</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {errors.general && <Alert severity="error">{errors.general}</Alert>}
                    {success && <Alert severity="success">Restaurant updated successfully!</Alert>}

                    {field("Restaurant Name", "restaurantName")}
                    {field("Street Address", "streetAddress")}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {field("Unit / Suite (optional)", "unit")}
                        {field("City", "city")}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {field("Province", "province")}
                        {field("Postal Code", "postalCode")}
                    </Box>

                    <Typography variant="body2" color="text.secondary">Contact & Website</Typography>

                    {field("Phone Number (optional)", "phoneNumber")}
                    {field("Website URL (optional)", "websiteUrl")}

                    <Typography variant="body2" color="text.secondary">Details</Typography>

                    {field("Cuisine Type (optional)", "cuisine")}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {field("Opening Time", "openingTime", { type: 'time', InputLabelProps: { shrink: true } })}
                        {field("Closing Time", "closingTime", { type: 'time', InputLabelProps: { shrink: true } })}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRestaurantDialog;