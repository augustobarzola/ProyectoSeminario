CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE
);

CREATE TABLE domicilios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calle VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    pais VARCHAR(100) NOT NULL
);	

CREATE TABLE gimnasios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_domicilio INT NOT NULL,
    correo VARCHAR(70),
    telefono VARCHAR(15),
    motivo_baja VARCHAR(500),
    fecha_alta DATE NOT NULL,
    fecha_baja DATE,
    FOREIGN KEY (id_domicilio) REFERENCES domicilios(id)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(12) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE,
    motivo_baja VARCHAR(500),
    id_gimnasio INT,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id)
);

CREATE TABLE usuarios_roles (
	id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

CREATE TABLE especialidades (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_gimnasio INT NOT NULL,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id)
);

CREATE TABLE usuarios_especialidades (
	id_usuario INT NOT NULL,
    id_especialidad INT NOT NULL,
    PRIMARY KEY (id_usuario, id_especialidad),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id)
);

CREATE TABLE personas (
    id_usuario INT PRIMARY KEY,
    documento VARCHAR(12) NOT NULL UNIQUE,
    sexo VARCHAR(12) NOT NULL,
    nombre VARCHAR(64) NOT NULL,
    apellido VARCHAR(64) NOT NULL,
    fecha_nacimiento DATE,
    id_domicilio INT,
    correo VARCHAR(70),
    telefono VARCHAR(15),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_domicilio) REFERENCES domicilios(id)
);

CREATE TABLE ejercicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_gimnasio INT NOT NULL,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id)
);

CREATE TABLE rutinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rutina VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATE,
    id_entrenador INT NOT NULL,
    id_gimnasio INT NOT NULL,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id),
    FOREIGN KEY (id_entrenador) REFERENCES usuarios(id)
);

CREATE TABLE detalles_rutina_ejercicios (
    id_rutina INT NOT NULL,
    id_ejercicio INT NOT NULL,
    series INT NOT NULL,
    repeticiones VARCHAR(100) NOT NULL,
    tiempo_descanso INT, -- Tiempo de descanso en segundos
    explicacion TEXT,
    PRIMARY KEY (id_rutina, id_ejercicio),
    FOREIGN KEY (id_rutina) REFERENCES rutinas(id),
    FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id)
);

CREATE TABLE clientes_rutinas (
    id_cliente INT NOT NULL,
    id_rutina INT NOT NULL,
    observaciones TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    PRIMARY KEY (id_cliente, id_rutina),
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_rutina) REFERENCES rutinas(id)
);

CREATE TABLE asistencias (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_recepcionista INT,
    fecha_ingreso DATETIME NOT NULL,
    id_gimnasio INT NOT NULL,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id),
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_recepcionista) REFERENCES usuarios(id)
);

CREATE TABLE metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE planes_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE,
    id_gimnasio INT NOT NULL,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id)
);

CREATE TABLE detalle_planes_pago (
    id_plan_pago INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE,
    PRIMARY KEY (id_plan_pago, id_metodo_pago),
    FOREIGN KEY (id_plan_pago) REFERENCES planes_pago(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id)
);

CREATE TABLE clientes_planes_pago (
    id_cliente INT NOT NULL,
    id_plan_pago INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    PRIMARY KEY (id_cliente, id_plan_pago),
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_plan_pago) REFERENCES planes_pago(id)
);

CREATE TABLE clientes_pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_plan_pago INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    fecha_pago DATE NOT NULL,
    importe DECIMAL(10, 2) NOT NULL,
    id_gimnasio INT NOT NULL,
    FOREIGN KEY (id_gimnasio) REFERENCES gimnasios(id),
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_plan_pago) REFERENCES planes_pago(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id)
);