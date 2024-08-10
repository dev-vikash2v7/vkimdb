import json
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the PostgreSQL database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/imdb_clone'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Movie(db.Model):
    _tablename_ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    genre = db.Column(db.String(100), nullable=False)
    director = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'year': self.year,
            'genre': self.genre,
            'director': self.director,
            'rating': self.rating
        }

def load_movies_from_json(file_path):
    with open(file_path, 'r') as file:
        movies_data = json.load(file)
        for movie_data in movies_data:
            new_movie = Movie(
                title=movie_data['title'],
                year=movie_data['year'],
                genre=movie_data['genre'],
                director=movie_data['director'],
                rating=movie_data['rating']
            )
            db.session.add(new_movie)
        db.session.commit()

@app.route('/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.all()
    return jsonify([movie.to_dict() for movie in movies]), 200

@app.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    return jsonify(movie.to_dict()), 200

@app.route('/movies', methods=['POST'])
def add_movie():
    data = request.json
    new_movie = Movie(
        title=data['title'],
        year=data['year'],
        genre=data['genre'],
        director=data['director'],
        rating=data['rating']
    )
    db.session.add(new_movie)
    db.session.commit()
    return jsonify(new_movie.to_dict()), 201

@app.route('/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    data = request.json
    movie.title = data.get('title', movie.title)
    movie.year = data.get('year', movie.year)
    movie.genre = data.get('genre', movie.genre)
    movie.director = data.get('director', movie.director)
    movie.rating = data.get('rating', movie.rating)
    db.session.commit()
    return jsonify(movie.to_dict()), 200

@app.route('/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    db.session.delete(movie)
    db.session.commit()
    return jsonify({'message': 'Movie deleted'}), 200

if __name__ == '__main__':
    with app.app_context():  # Ensure the application context is active
        db.create_all()  # Create tables in the database
        load_movies_from_json('movies.json')  # Load data from JSON and insert into the database
    app.run(debug=True)
