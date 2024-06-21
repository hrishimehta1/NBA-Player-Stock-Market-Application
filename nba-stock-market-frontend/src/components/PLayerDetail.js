import { Button, Card, CardActions, CardContent, Container, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socketService';

function PlayerDetail() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            const response = await axios.get(`/api/players/${id}`);
            setPlayer(response.data);
            drawChart(response.data.history);
        };

        fetchPlayer();

        socket.on('playerUpdated', (updatedPlayer) => {
            if (updatedPlayer._id === id) {
                setPlayer(updatedPlayer);
                drawChart(updatedPlayer.history);
            }
        });

        return () => {
            socket.off('playerUpdated');
        };
    }, [id]);

    const drawChart = (data) => {
        d3.select('#chart').selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 30, left: 40 },
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.price)])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(y));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => x(new Date(d.date)))
                .y(d => y(d.price))
            );

        svg.selectAll('dot')
            .data(data)
            .enter().append('circle')
            .attr('cx', d => x(new Date(d.date)))
            .attr('cy', d => y(d.price))
            .attr('r', 5)
            .attr('fill', '#69b3a2');
    };

    if (!player) return <div>Loading...</div>;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                {player.name}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Team: {player.team}</Typography>
                            <Typography variant="h6" gutterBottom>Position: {player.position}</Typography>
                            <Typography variant="h6" gutterBottom>Stock Price: ${player.stockPrice.toFixed(2)}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">Buy Shares</Button>
                            <Button size="small" color="secondary">Sell Shares</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper>
                        <Typography variant="h6" gutterBottom>Historical Prices
