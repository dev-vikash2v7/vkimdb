import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Card, Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import your CSS file
import StarRatings from 'react-star-ratings'; // Import the StarRatings component

function Home() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 5; // Show 5 movies per page

    useEffect(() => {
        fetch('/movies')
            .then(response => response.json())
            .then(data => setMovies(data))
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(movies.length / moviesPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">
                        <img src="./public/images/cinema.jpg" alt=" " className="navbar-logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#about">About</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                            <NavDropdown title="Profile" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-4">
                <Helmet>
                    <title>Home - Movie App</title>
                </Helmet>
                <h1 className="text-center mb-4">HOME PAGE</h1>
                <Row>
                    {currentMovies.map((movie) => (
                        <Col md={12} key={movie.id} className="mb-4">
                            <Card className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)}>
                                <Row noGutters>
                                    <Col md={4}>
                                        <Card.Img className="movie-image" src={movie.image_url} alt={movie.title} />
                                    </Col>
                                    <Col md={8}>
                                        <Card.Body>
                                            <Card.Title className="movie-title">{movie.title}</Card.Title>
                                            <Card.Text>
                                                {movie.short_description}
                                            </Card.Text>
                                            <Card.Text className="rating-container">
                                                <strong>Rating:</strong>
                                                <div className="rating-stars">
                                                    <StarRatings
                                                        rating={movie.rating}
                                                        starRatedColor="gold"
                                                        numberOfStars={5}
                                                        starDimension="20px"
                                                        starSpacing="2px"
                                                        name='rating'
                                                    />
                                                </div>
                                            </Card.Text>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="d-flex justify-content-center mt-4">
                    {pageNumbers.map(number => (
                        <Button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            disabled={number === currentPage}
                            variant={number === currentPage ? 'secondary' : 'primary'}
                            className="mx-1 pagination-button"
                        >
                            {number}
                        </Button>
                    ))}
                </div>
            </Container>
        </>
    );
}

export default Home;
