import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Alert, CircularProgress, MenuItem, Select,
    InputLabel, FormControl
} from '@mui/material';

const CreateDealDialog = ({ open, handleClose, uuid, ownerRestaurants, onDealCreated }) => {
    const [dealName, setDealName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [dealPrice, setDealPrice] = React.useState('');
    const [validFrom, setValidFrom] = React.useState('');
    const [validTo, setValidTo] = React.useState('');
    const [restaurantId, setRestaurantId] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const today = new Date().toISOString().split('T')[0];

    const reset = () => {
        setDealName(''); setDescription(''); setDealPrice('');
        setValidFrom(''); setValidTo(''); setRestaurantId('');
        setErrors({}); setSuccess(false);
    };

    const validate = () => {
        const newErrors = {};
        if (!restaurantId) newErrors.restaurantId = "Select a restaurant";
        if (!dealName.trim()) newErrors.dealName = "Deal title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!dealPrice || isNaN(dealPrice) || parseFloat(dealPrice) <= 0)
            newErrors.dealPrice = "Enter a valid price";
        if (!validFrom) newErrors.validFrom = "Start date is required";
        if (validFrom && validTo && validTo < validFrom)
            newErrors.validTo = "End date must be after start date";
        return newErrors;
    };

    const handleSubmit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/owner/deals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantId, dealName, description,
                    dealPrice: parseFloat(dealPrice),
                    validFrom, 
                    validTo: validTo || null,
                    createdBy: uuid
                })
            });
            if (!res.ok) throw new Error("Failed to create deal");
            setSuccess(true);
            onDealCreated(); // reload the deal list
            setTimeout(() => { reset(); handleClose(); }, 2000);
        } catch (err) {
            setErrors({ general: "Failed to post deal. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => { reset(); handleClose(); }} maxWidth="sm" fullWidth>
            <DialogTitle>Post a New Deal</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

                    {errors.general && <Alert severity="error">{errors.general}</Alert>}
                    {success && <Alert severity="success">Deal posted successfully!</Alert>}

                    {/* Restaurant picker */}
                    <FormControl fullWidth size="small" error={!!errors.restaurantId}>
                        <InputLabel>Restaurant</InputLabel>
                        <Select
                            value={restaurantId}
                            onChange={(e) => setRestaurantId(e.target.value)}
                            label="Restaurant"
                        >
                            {ownerRestaurants.map(r => (
                                <MenuItem key={r.restaurant_id} value={r.restaurant_id}>
                                    {r.restaurant_name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.restaurantId && <Alert severity="error" sx={{ mt: 0.5 }}>{errors.restaurantId}</Alert>}
                    </FormControl>

                    <TextField
                        label="Deal Title"
                        fullWidth size="small"
                        value={dealName}
                        onChange={(e) => setDealName(e.target.value)}
                        error={!!errors.dealName}
                        helperText={errors.dealName}
                    />

                    <TextField
                        label="Description"
                        fullWidth size="small" multiline rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    <TextField
                        label="Price ($)"
                        fullWidth size="small" type="number"
                        value={dealPrice}
                        onChange={(e) => setDealPrice(e.target.value)}
                        error={!!errors.dealPrice}
                        helperText={errors.dealPrice}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Valid From"
                            type="date" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: today }}
                            value={validFrom}
                            onChange={(e) => setValidFrom(e.target.value)}
                            error={!!errors.validFrom}
                            helperText={errors.validFrom}
                        />
                        <TextField
                            label="Valid To (optional)"
                            type="date" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: validFrom || today }}
                            value={validTo}
                            onChange={(e) => setValidTo(e.target.value)}
                            error={!!errors.validTo}
                            helperText={errors.validTo || "Leave blank for no expiry"}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { reset(); handleClose(); }} disabled={loading}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Post Deal"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDealDialog;