import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Alert, CircularProgress,
    Checkbox, FormControlLabel, FormGroup, Typography
} from '@mui/material';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditDealDialog = ({ open, handleClose, deal, onDealUpdated, onDealDeleted }) => {
    const [dealName, setDealName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [dealPrice, setDealPrice] = React.useState('');
    const [validFrom, setValidFrom] = React.useState('');
    const [validTo, setValidTo] = React.useState('');
    const [selectedDays, setSelectedDays] = React.useState([]);
    const [startTime, setStartTime] = React.useState('');
    const [endTime, setEndTime] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    React.useEffect(() => {
        if (deal) {
            setDealName(deal.dealName || '');
            setDescription(deal.dealDescription || '');
            setDealPrice(deal.dealPrice || '');
            setValidFrom(deal.validFrom || '');
            setValidTo(deal.validTo || '');
            setSelectedDays(deal.dealDays || []);
            setStartTime(deal.startTime || '');
            setEndTime(deal.endTime || '');
            setErrors({});
            setSuccess(false);
            setConfirmDelete(false);
        }
    }, [deal]);

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const validate = () => {
        const newErrors = {};
        if (!dealName.trim()) newErrors.dealName = "Deal title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!dealPrice || isNaN(dealPrice) || parseFloat(dealPrice) <= 0)
            newErrors.dealPrice = "Enter a valid price";
        if (!validFrom) newErrors.validFrom = "Start date is required";
        if (validFrom && validTo && validTo < validFrom)
            newErrors.validTo = "End date must be after start date";
        if (selectedDays.length === 0) newErrors.days = "Select at least one day";
        if (!startTime) newErrors.startTime = "Start time is required";
        if (!endTime) newErrors.endTime = "End time is required";
        if (startTime && endTime && endTime <= startTime)
            newErrors.endTime = "End time must be after start time";
        return newErrors;
    };

    const handleSave = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            const res = await fetch(`/api/owner/deals/${deal.dealID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dealName, description,
                    dealPrice: parseFloat(dealPrice),
                    validFrom, validTo: validTo || null,
                    selectedDays, startTime, endTime
                })
            });
            if (!res.ok) throw new Error();
            setSuccess(true);
            onDealUpdated();
            setTimeout(handleClose, 2000);
        } catch {
            setErrors({ general: "Failed to update deal. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/owner/deals/${deal.dealID}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            onDealDeleted(deal.dealID);
            handleClose();
        } catch {
            setErrors({ general: "Failed to delete deal. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {errors.general && <Alert severity="error">{errors.general}</Alert>}
                    {success && <Alert severity="success">Deal updated successfully!</Alert>}

                    <TextField label="Deal Title" fullWidth size="small"
                        value={dealName} onChange={(e) => setDealName(e.target.value)}
                        error={!!errors.dealName} helperText={errors.dealName} />

                    <TextField label="Description" fullWidth size="small" multiline rows={3}
                        value={description} onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description} helperText={errors.description} />

                    <TextField label="Price ($)" fullWidth size="small" type="number"
                        value={dealPrice} onChange={(e) => setDealPrice(e.target.value)}
                        error={!!errors.dealPrice} helperText={errors.dealPrice} />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Valid From" type="date" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            value={validFrom} onChange={(e) => setValidFrom(e.target.value)}
                            error={!!errors.validFrom} helperText={errors.validFrom} />
                        <TextField label="Valid To (optional)" type="date" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            value={validTo} onChange={(e) => setValidTo(e.target.value)}
                            error={!!errors.validTo} helperText={errors.validTo || "Leave blank for no expiry"} />
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Available Days</Typography>
                        <FormGroup row>
                            {DAYS.map(day => (
                                <FormControlLabel
                                    key={day}
                                    control={
                                        <Checkbox
                                            checked={selectedDays.includes(day)}
                                            onChange={() => toggleDay(day)}
                                            size="small"
                                        />
                                    }
                                    label={day.slice(0, 3)}
                                />
                            ))}
                        </FormGroup>
                        {errors.days && <Alert severity="error" sx={{ mt: 0.5 }}>{errors.days}</Alert>}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField label="Start Time" type="time" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            value={startTime} onChange={(e) => setStartTime(e.target.value)}
                            error={!!errors.startTime} helperText={errors.startTime} />
                        <TextField label="End Time" type="time" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            value={endTime} onChange={(e) => setEndTime(e.target.value)}
                            error={!!errors.endTime} helperText={errors.endTime} />
                    </Box>

                    {confirmDelete && (
                        <Alert severity="warning">Are you sure you want to delete this deal? This cannot be undone.</Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <Box>
                    {!confirmDelete ? (
                        <Button color="error" onClick={() => setConfirmDelete(true)} disabled={loading}>Delete Deal</Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
                                {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm Delete"}
                            </Button>
                            <Button onClick={() => setConfirmDelete(false)} disabled={loading}>Cancel</Button>
                        </Box>
                    )}
                </Box>
                <Box>
                    <Button onClick={handleClose} disabled={loading} sx={{ mr: 1 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default EditDealDialog;