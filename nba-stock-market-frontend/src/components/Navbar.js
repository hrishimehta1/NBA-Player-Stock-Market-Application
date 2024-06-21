import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/auth';
    };

    return (
        <AppBar position="static">
            <Container>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        NBA Stock Market
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/portfolio">Portfolio</Button>
                    <Button color="inherit" component={Link} to="/auth">Login/Register</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
