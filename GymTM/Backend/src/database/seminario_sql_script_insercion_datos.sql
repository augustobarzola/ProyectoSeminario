-- Insertar domicilios
INSERT INTO domicilios (calle, numero, ciudad, provincia, codigo_postal, pais)
VALUES 
('Calle Falsa', '123', 'Córdoba', 'Córdoba', '5000', 'Argentina'),
('Avenida Siempre Viva', '742', 'Buenos Aires', 'Buenos Aires', '1000', 'Argentina');

-- Insertar gimnasios
INSERT INTO gimnasios (nombre, id_domicilio, correo, telefono, fecha_alta, fecha_baja)
VALUES 
('Gimnasio Central', 1, 'info@gimnasiocentral.com', '3512345678', '2024-01-01', NULL),
('Gimnasio Norte', 2, 'contacto@gimnasionorte.com', '3519876543', '2024-01-01', NULL);

-- Insertar roles
INSERT INTO roles (nombre, descripcion, fecha_alta, fecha_baja)
VALUES 
('Administrador', 'Acceso completo al sistema', '2024-01-01', NULL),
('Recepcionista', 'Gestión de clientes y pagos', '2024-01-01', NULL),
('Entrenador', 'Gestión de rutinas y clientes', '2024-01-01', NULL),
('Cliente', 'Acceso limitado como cliente', '2024-01-01', NULL);

-- Insertar usuarios
INSERT INTO usuarios (usuario, contrasenia, fecha_alta, fecha_baja, id_gimnasio)
VALUES 
('12345678', '$2b$10$2rSQgTAAIXOcoCqUR4DRd.CIPbvi4e8eKyOMxMSzRbbEGB11pQJiS', '2024-01-01', NULL, 1),  -- Administrador Gimnasio Central
('23456789', '$2b$10$CmERQrTHyUKMYWX0ISdUm.kf6OxQafy/bpnXwPbCJ6.Qoz1GAbksu', '2024-01-02', NULL, 1),  -- Recepcionista Gimnasio Central
('34567890', '$2b$10$a.ukggczQr7O/E5l9gBTeuJC02Jo0W3xXiJZRghVJZlWR0Z8txpYS', '2024-01-02', NULL, 1),  -- Entrenador Gimnasio Central
('45678901', '$2b$10$XvOhQA1TpvXQV3HoatDz1uuR5zbtjwER1aQzOp39YmiPK9obP8k0i', '2024-01-03', NULL, 2);  -- Cliente Gimnasio Norte

-- Insertar los roles de los usuarios
INSERT INTO usuarios_roles (id_usuario, id_rol)
VALUES 
(1, 1),  -- Administrador
(2, 2),  -- Recepcionista
(3, 3),  -- Entrenador
(4, 4);  -- Cliente

-- Insertar personas
INSERT INTO personas (id_usuario, documento, sexo, nombre, apellido, fecha_nacimiento, id_domicilio, correo, telefono)
VALUES 
(1, '12345678', 'Masculino', 'Admin', 'Admin', '1980-01-01', 1, 'admin@gimnasiocentral.com', '3512345678'),
(2, '23456789', 'Masculino', 'Carlos', 'Lopez', '1985-04-10', 1, 'recepcionista@gimnasiocentral.com', '3512345679'),
(3, '34567890', 'Femenino', 'Maria', 'Gonzalez', '1990-05-15', 1, 'maria@gimnasiocentral.com', '3512345680'),
(4, '45678901', 'Masculino', 'Juan', 'Sanchez', '1995-06-20', 2, 'juan@gimnasionorte.com', '3519876543');

INSERT INTO especialidades (nombre, descripcion, id_gimnasio)
VALUES 
('Musculación', 'Entrenamiento para aumentar la masa muscular', 1),
('CrossFit', 'Entrenamiento funcional de alta intensidad', 1),
('Yoga', 'Práctica de equilibrio y flexibilidad', 2);

INSERT INTO usuarios_especialidades (id_usuario, id_especialidad)
VALUES 
(3, 1),  -- Entrenador especializado en Musculación
(3, 2);  -- Entrenador especializado en CrossFit

-- Insertar ejercicios
INSERT INTO ejercicios (nombre, descripcion, id_gimnasio)
VALUES 
('Press de banca', 'Ejercicio de fuerza para el pecho', 1),
('Sentadilla', 'Ejercicio compuesto para piernas', 1),
('Dominadas', 'Ejercicio de tracción para la espalda', 1);

-- Insertar rutinas
INSERT INTO rutinas (nombre_rutina, descripcion, fecha_creacion, id_entrenador, id_gimnasio)
VALUES 
('Rutina Fuerza', 'Rutina enfocada en fuerza para todo el cuerpo', '2024-01-03', 3, 1),
('Rutina Hipertrofia', 'Rutina enfocada en el desarrollo muscular', '2024-01-04', 3, 1);

-- Insertar detalles de rutina
INSERT INTO detalles_rutina_ejercicios (id_rutina, id_ejercicio, series, repeticiones, tiempo_descanso, explicacion)
VALUES 
(1, 1, 4, '10 repeticiones', 90, 'Realizar con buen control'),
(1, 2, 4, '8 repeticiones', 120, 'Mantener postura correcta'),
(2, 3, 3, 'Hasta el fallo', 60, 'Mantener el core contraído');

-- Insertar asistencias
INSERT INTO asistencias (id_cliente, id_recepcionista, fecha_ingreso, id_gimnasio)
VALUES 
(4, 2, '2024-01-05 08:00:00', 2);

-- Insertar métodos de pago
INSERT INTO metodos_pago (nombre)
VALUES 
('Efectivo'),
('Transferencia'),
('Tarjeta de Débito'), 
('Tarjeta de Crédito'),
('Débito Automático');

-- Insertar planes de pago
INSERT INTO planes_pago (nombre, descripcion, fecha_alta, fecha_baja, id_gimnasio)
VALUES 
('Plan Mensual', 'Acceso completo mensual', '2024-01-01', NULL, 1),
('Plan Semestral', 'Acceso con descuento por 6 meses', '2024-01-02', NULL, 1),
('Plan Anual', 'Acceso anual con descuento', '2024-01-01', NULL, 1),
('Plan Mensual', 'Acceso completo mensual', '2024-01-01', NULL, 2),
('Plan Semestral', 'Acceso con descuento por 6 meses', '2024-01-02', NULL, 2),
('Plan Anual', 'Acceso anual con descuento', '2024-01-01', NULL, 2);

-- Insertar asociaciones de planes y métodos de pago
INSERT INTO planes_metodos_pago (id_plan_pago, id_metodo_pago, precio, fecha_alta, fecha_baja)
VALUES 
(1, 1, 100.00, '2024-01-01', NULL),
(1, 2, 105.00, '2024-01-01', NULL),
(4, 1, 110.00, '2024-01-01', NULL),
(4, 2, 115.00, '2024-01-01', NULL);

-- Insertar pagos
INSERT INTO pagos (id_cliente, id_plan_pago, id_metodo_pago, fecha_pago, importe, id_gimnasio)
VALUES 
(4, 4, 1, '2024-01-07', 110.00, 2);  -- Juan pagó el Plan Mensual en Efectivo en Gimnasio Norte

-- Insertar clientes en rutinas
INSERT INTO clientes_rutinas (id_cliente, id_rutina, observaciones, fecha_inicio, fecha_fin)
VALUES 
(4, 1, 'Cliente con buena evolución en fuerza', '2024-01-06', NULL);  -- Rutina de Juan en Gimnasio Norte

-- Insertar planes de pago en clientes
INSERT INTO clientes_planes_pago (id_cliente, id_plan_pago, fecha_inicio, fecha_fin)
VALUES 
(4, 4, '2024-01-01', '2024-02-01');  -- Plan de pago de Juan en Gimnasio Norte