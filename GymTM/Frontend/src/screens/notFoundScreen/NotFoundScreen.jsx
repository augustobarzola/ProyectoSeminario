import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NotFoundScreen.css";

const NotFoundScreen = () => {
  return (
    <div className="container pt-5 d-flex flex-column align-items-center justify-content-center text-center">
      <div>
        <h2>Oops</h2>
        <p>La página que estás buscando no existe.</p>

        <Button
          size="lg"
          className="mt-3 btn-primary-gradient rounded-pill"
        >
          <span>      
            <Link
              to="/"
              className="text-white text-decoration-none"
            >
              Inicio
            </Link>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundScreen;
