import { Container, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlayerList() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get('/api/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.log(error));
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                NBA Player Stock Market
            </Typography>
            <Paper>
                <List>
                    {players.map(player => (
                        <ListItem button component={Link} to={`/player/${player._id}`} key={player._id}>
                            <ListItemText primary={`${player.name} - $${player.stockPrice.toFixed(2)}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
}

export default PlayerList;
