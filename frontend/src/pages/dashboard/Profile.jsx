import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Avatar, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: '', bio: '', profilePic: '' });
  const token = useSelector((state) => state.misc.token);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/getuserdata', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUser(data);
        setUpdatedUser({
          username: data.username,
          bio: data.bio,
          profilePic: data.profilePic,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (token && token.token) {
      fetchUserData();
    }
  }, [token]);

  const changeProfileHandler = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/addmoredata', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  if (!user) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 600, margin: '0 auto', padding: 3, boxShadow: 4 }}>
        <CardContent>
          <Box className="flex flex-col items-center">
            <Avatar
              src={user.profilePic}
              alt={user.username}
              sx={{ width: 120, height: 120, mb: 2, boxShadow: 2 }}
            />
            <Typography variant="h5" component="div" gutterBottom>{user.username}</Typography>
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>{user.bio}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, width: '100%' }}
              onClick={() => setIsEditMode(true)}
            >
              Edit Profile
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditMode} onClose={() => setIsEditMode(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            value={updatedUser.username}
            onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Bio"
            fullWidth
            multiline
            rows={4}
            value={updatedUser.bio}
            onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Profile Picture URL"
            fullWidth
            value={updatedUser.profilePic}
            onChange={(e) => setUpdatedUser({ ...updatedUser, profilePic: e.target.value })}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditMode(false)}>Cancel</Button>
          <Button variant="contained" onClick={changeProfileHandler}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
