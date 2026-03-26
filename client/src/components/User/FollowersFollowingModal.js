import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

/**
 * FollowersFollowingModal
 * Props:
 *   open        - boolean
 *   onClose     - function
 *   mode        - "followers" | "following"
 *   userID      - the profile being viewed (whose followers/following to load)
 */
const FollowersFollowingModal = ({ open, onClose, mode, userID }) => {
  const navigate = useNavigate();

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open || !userID) return;

    setLoading(true);
    setError("");
    setUsers([]);

    fetch("/api/follow/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, mode }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to load users. Please try again."))
      .finally(() => setLoading(false));
  }, [open, userID, mode]);

  const handleUserClick = (user) => {
    onClose();
    const route = user.user_type === "restaurant_owner" ? "/Owner" : "/User";
    navigate(`${route}?id=${user.id}`);
  };

  const title = mode === "followers" ? "Followers" : "Following";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { bgcolor: "background.default", borderRadius: 3, p: 1 } }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && users.length === 0 && (
          <Typography color="text.secondary">
            {mode === "followers" ? "No followers yet." : "Not following anyone yet."}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {users.map((user) => (
            <Grid item xs={12} key={user.id}>
              <Paper
                elevation={1}
                onClick={() => handleUserClick(user)}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  borderRadius: 2,
                  "&:hover": { filter: "brightness(0.96)", boxShadow: 3 },
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {user.profile_photo && user.profile_photo.length <= 2
                    ? user.profile_photo
                    : <PersonIcon />}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {user.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.user_type === "restaurant_owner" ? "Restaurant Owner" : "Regular User"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            bgcolor: "primary.dark",
            color: "secondary.dark",
            px: 3,
            "&:hover": { bgcolor: "primary.main" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FollowersFollowingModal;