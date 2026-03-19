import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Alert, CircularProgress
} from '@mui/material';

const EditDealDialog = ({ open, handleClose, deal, onDealUpdated, onDealDeleted }) => {
    const [dealName, setDealName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [dealPrice, setDealPrice] = React.useState('');
    const [validFrom, setValidFrom] = React.useState('');
    const [validTo, setValidTo] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    // Populate fields when deal changes
    React.useEffect(() => {
        if (deal) {
            setDealName(deal.dealName || '');
            setDescription(deal.dealDescription || '');
            setDealPrice(deal.dealPrice || '');
            setValidFrom(deal.validFrom || '');
            setValidTo(deal.validTo || '');
            setErrors({});
            setSuccess(false);
            setConfirmDelete(false);
        }
    }, [deal]);

    const validate = () => {
        const newErrors = {};
        if (!dealName.trim()) newErrors.dealName = "Deal title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!dealPrice || isNaN(dealPrice) || parseFloat(dealPrice) <= 0)
            newErrors.dealPrice = "Enter a valid price";
        if (!validFrom) newErrors.validFrom = "Start date is required";
        if (validFrom && validTo && validTo < validFrom)
            newErrors.validTo = "End date must be after start date";
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
                body: JSON.stringify({ dealName, description, dealPrice: parseFloat(dealPrice), validFrom, validTo: validTo || null })
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
                        <TextField label="Valid To" type="date" fullWidth size="small"
                            InputLabelProps={{ shrink: true }}
                            value={validTo} onChange={(e) => setValidTo(e.target.value)}
                            error={!!errors.validTo} helperText={errors.validTo} />
                    </Box>

                    {/* Delete confirmation */}
                    {confirmDelete && (
                        <Alert severity="warning">
                            Are you sure you want to delete this deal? This cannot be undone.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
                {/* Delete on the left */}
                <Box>
                    {!confirmDelete ? (
                        <Button color="error" onClick={() => setConfirmDelete(true)} disabled={loading}>
                            Delete Deal
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
                                {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm Delete"}
                            </Button>
                            <Button onClick={() => setConfirmDelete(false)} disabled={loading}>Cancel</Button>
                        </Box>
                    )}
                </Box>
                {/* Save/Cancel on the right */}
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