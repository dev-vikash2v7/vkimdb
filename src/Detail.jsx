import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Detail() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`/movies/${movieId}`)
            .then(response => response.json())
            .then(data => setMovie(data))
            .catch(error => console.error('Error fetching movie details:', error));
    }, [movieId]);

    if (!movie) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-4 detail-container">
            <Helmet>
                <title>{movie.title} - Movie App</title>
            </Helmet>
            <h1 className="mb-4">{movie.title}</h1>
            <img src={movie.image_url} alt={movie.title} className="img-fluid mb-4" />
            <p>{movie.long_description}</p>
            <p className="rating">Rating: {movie.rating}</p>
        </Container>
    );
}

export default Detail;
