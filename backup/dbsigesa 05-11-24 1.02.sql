-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2024 at 08:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbsigesa`
--

-- --------------------------------------------------------

--
-- Table structure for table `sigm_categoria_producto`
--

CREATE TABLE `sigm_categoria_producto` (
  `ID_CATEGORIA_PRODUCTO` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_DESCRIPCION` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigm_colaborador`
--

CREATE TABLE `sigm_colaborador` (
  `ID_COLABORADOR` int(11) NOT NULL,
  `ID_DEPARTAMENTO` int(11) DEFAULT NULL,
  `ID_PUESTO` int(11) DEFAULT NULL,
  `DSC_SEGUNDO_APELLIDO` varchar(255) DEFAULT NULL,
  `FEC_NACIMIENTO` date DEFAULT NULL,
  `NUM_TELEFONO` varchar(20) DEFAULT NULL,
  `FEC_INGRESO` date DEFAULT NULL,
  `FEC_SALIDA` date DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL,
  `DSC_CORREO` varchar(255) DEFAULT NULL,
  `DSC_CEDULA` varchar(20) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PRIMER_APELLIDO` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_colaborador`
--

INSERT INTO `sigm_colaborador` (`ID_COLABORADOR`, `ID_DEPARTAMENTO`, `ID_PUESTO`, `DSC_SEGUNDO_APELLIDO`, `FEC_NACIMIENTO`, `NUM_TELEFONO`, `FEC_INGRESO`, `FEC_SALIDA`, `ESTADO`, `DSC_CORREO`, `DSC_CEDULA`, `DSC_NOMBRE`, `DSC_PRIMER_APELLIDO`) VALUES
(1, 1, 1, 'González', '2001-08-25', '63133860', '2022-09-01', NULL, 1, 'adam.acuna.gonzalez@est.una.ac.cr', '118200907A', 'Adam', 'Acuña'),
(2, 1, 1, 'Gómez', '2001-10-16', '85218760', '2022-09-01', NULL, 1, 'karolayvargasg@gmail.com', '5461623101989', 'Karolay', 'Vargas'),
(3, 1, 1, 'Ramírez', '1990-07-15', '62452341', '2021-06-12', NULL, 1, 'lucia.ramirez@empresa.com', '109876543', 'Lucía', 'Pérez'),
(4, 1, 1, 'Vargas', '1985-09-30', '63214578', '2020-05-01', NULL, 1, 'juan.vargas@empresa.com', '234567890', 'Juan', 'Gómez'),
(5, 1, 1, 'Rodríguez', '1993-01-10', '61543298', '2022-07-20', NULL, 1, 'maria.rodriguez@empresa.com', '345678901', 'María', 'Lopez'),
(6, 1, 1, 'Sánchez', '1992-12-15', '62341257', '2023-01-15', NULL, 1, 'diego.sanchez@empresa.com', '456789012', 'Diego', 'Hernández'),
(7, 1, 1, 'Guzmán', '1988-04-22', '62134679', '2021-09-10', NULL, 1, 'andrea.guzman@empresa.com', '567890123', 'Andrea', 'Martínez'),
(8, 1, 1, 'Mejía', '1989-11-03', '62547812', '2020-12-05', NULL, 1, 'carlos.mejia@empresa.com', '678901234', 'Carlos', 'Jiménez'),
(9, 1, 1, 'Solís', '1991-02-14', '62014567', '2021-03-17', NULL, 1, 'diana.solis@empresa.com', '789012345', 'Diana', 'García'),
(10, 1, 1, 'Rojas', '1995-06-29', '62894312', '2022-04-09', NULL, 1, 'fernando.rojas@empresa.com', '890123456', 'Fernando', 'Castro'),
(11, 1, 1, 'Pacheco', '1994-10-18', '62983451', '2023-02-11', NULL, 1, 'ana.pacheco@empresa.com', '901234567', 'Ana', 'Vega'),
(12, 1, 1, 'Valverde', '1987-08-24', '61983745', '2019-11-22', NULL, 1, 'roberto.valverde@empresa.com', '912345678', 'Roberto', 'Chacón'),
(13, 1, 1, 'Mora', '1996-03-27', '62674930', '2022-06-14', NULL, 1, 'sofia.mora@empresa.com', '923456789', 'Sofía', 'Ortega'),
(14, 1, 1, 'Arias', '1992-05-12', '61734982', '2023-05-21', NULL, 1, 'gabriel.arias@empresa.com', '934567890', 'Gabriel', 'Monge'),
(15, 1, 1, 'García', '1993-07-08', '62245839', '2021-08-02', NULL, 1, 'raquel.garcia@empresa.com', '945678901', 'Raquel', 'Alvarado'),
(16, 1, 1, 'Zamora', '1986-09-19', '62493817', '2020-09-23', NULL, 1, 'esteban.zamora@empresa.com', '956789012', 'Esteban', 'Vargas'),
(17, 1, 1, 'Murillo', '1989-10-11', '62983721', '2021-10-13', NULL, 1, 'karla.murillo@empresa.com', '967890123', 'Karla', 'Rodríguez'),
(18, 1, 1, 'Castillo', '1990-11-25', '61834972', '2022-11-01', NULL, 1, 'daniel.castillo@empresa.com', '978901234', 'Daniel', 'Navarro'),
(19, 1, 1, 'Cordero', '1984-04-15', '61634892', '2019-01-29', NULL, 1, 'alicia.cordero@empresa.com', '989012345', 'Alicia', 'Torres'),
(20, 1, 1, 'Fernández', '1991-05-05', '61435982', '2020-03-14', NULL, 1, 'pablo.fernandez@empresa.com', '990123456', 'Pablo', 'Cruz'),
(21, 1, 1, 'Esquivel', '1993-12-23', '62038495', '2021-12-07', NULL, 1, 'monica.esquivel@empresa.com', '991234567', 'Mónica', 'Méndez');

-- --------------------------------------------------------

--
-- Table structure for table `sigm_comprobante_pago`
--

CREATE TABLE `sigm_comprobante_pago` (
  `ID_COMPROBANTE_PAGO` int(11) NOT NULL,
  `ID_ENTIDAD_FINANCIERA` int(11) DEFAULT NULL,
  `FEC_PAGO` date DEFAULT NULL,
  `NUM_COMPROBANTE_PAGO` varchar(255) DEFAULT NULL,
  `MONTO_COMPROBANTE_PAGO` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigm_cuenta_bancaria`
--

CREATE TABLE `sigm_cuenta_bancaria` (
  `ID_CUENTA_BANCARIA` int(11) NOT NULL,
  `ID_ENTIDAD_FINANCIERA` int(11) DEFAULT NULL,
  `DSC_BANCO` varchar(255) DEFAULT NULL,
  `NUM_CUENTA_BANCARIA` varchar(255) DEFAULT NULL,
  `TIPO_DIVISA` varchar(10) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigm_departamento`
--

CREATE TABLE `sigm_departamento` (
  `ID_DEPARTAMENTO` int(11) NOT NULL,
  `DSC_NOMBRE_DEPARTAMENTO` varchar(255) DEFAULT NULL,
  `DSC_DEPARTAMENTO` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_departamento`
--

INSERT INTO `sigm_departamento` (`ID_DEPARTAMENTO`, `DSC_NOMBRE_DEPARTAMENTO`, `DSC_DEPARTAMENTO`, `ESTADO`) VALUES
(1, 'Desarrollo', 'El departamento de desarrollo es el encargado de gestionar todo lo relacionado a la técnología dentro de la organización.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sigm_entidad_financiera`
--

CREATE TABLE `sigm_entidad_financiera` (
  `ID_ENTIDAD_FINANCIERA` int(11) NOT NULL,
  `DSC_NOMBRE_ENTIDAD_FINANCIERA` varchar(255) DEFAULT NULL,
  `TIPO_ENTIDAD_FINANCIERA` varchar(25) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigm_factura`
--

CREATE TABLE `sigm_factura` (
  `ID_FACTURA` int(11) NOT NULL,
  `ID_PROVEEDOR` int(11) DEFAULT NULL,
  `ID_COMPROBANTE_PAGO` int(11) DEFAULT NULL,
  `NUM_FACTURA` varchar(255) DEFAULT NULL,
  `FEC_FACTURA` date DEFAULT NULL,
  `DSC_DETALLE_FACTURA` text DEFAULT NULL,
  `MONTO_IMPUESTO` double DEFAULT NULL,
  `MONTO_DESCUENTO` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigm_producto`
--

CREATE TABLE `sigm_producto` (
  `ID_PRODUCTO` int(11) NOT NULL,
  `ID_CATEGORIA_PRODUCTO` int(11) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PRODUCTO` text DEFAULT NULL,
  `NUM_CANTIDAD` double DEFAULT NULL,
  `DSC_UNIDAD_MEDICION` varchar(50) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigm_proveedor`
--

CREATE TABLE `sigm_proveedor` (
  `ID_PROVEEDOR` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PROVINCIA` varchar(255) DEFAULT NULL,
  `DSC_CANTON` varchar(255) DEFAULT NULL,
  `DSC_DISTRITO` varchar(255) DEFAULT NULL,
  `DSC_DIRECCION` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_proveedor`
--

INSERT INTO `sigm_proveedor` (`ID_PROVEEDOR`, `DSC_NOMBRE`, `DSC_PROVINCIA`, `DSC_CANTON`, `DSC_DISTRITO`, `DSC_DIRECCION`, `ESTADO`) VALUES
(1, 'Proveedores S.A.', 'San José', 'San José', 'Carmen', 'Avenida 1, Calle 15', 1),
(2, 'Productos Verdes', 'Alajuela', 'Alajuela', 'Central', 'Calle 10, Casa 5', 1),
(3, 'Servicios Rápidos', 'Cartago', 'Cartago', 'Oriental', 'Calle 2, Frente a la plaza', 0),
(4, 'Distribuciones Globales', 'Guanacaste', 'Liberia', 'Central', 'Frente al parque central', 1),
(5, 'Electrodomésticos Costa Rica', 'Heredia', 'Heredia', 'Central', 'Calle 5, Edificio A', 1),
(6, 'Papelería Moderna', 'Puntarenas', 'Puntarenas', 'Central', 'Avenida 3, Local 4', 0),
(7, 'Comercializadora El Buen Sabor', 'San José', 'Escazú', 'San Rafael', 'Calle Vieja, Casa 10', 1),
(8, 'Ferretería La Excelencia', 'Limón', 'Limón', 'Central', 'Calle 6, Local 2', 1),
(9, 'Ropa y Estilo', 'Cartago', 'Turrialba', 'Turrialba', 'Calle 4, Local 1', 0),
(10, 'Transportes Rápidos CR', 'Alajuela', 'Naranjo', 'Naranjo', 'Calle 1, Km 5', 1),
(11, 'Nuevo Proveedor', 'Nueva Provincia', 'Nuevo Cantón', 'Nuevo Distrito', 'Nueva Direccion', 0),
(12, 'Nuevo', 'Nuevo', 'Nuevo', 'Nuevo', 'Nuevo', 0),
(13, 'otro nuevoEdicion', 'otro nuevo', 'otro nuevo', 'otro nuevo11', 'otro nuevo', 0),
(14, 'uno mas', 'uno mas', 'uno mas', 'uno mas', 'uno mas', 0),
(15, 'Proveedor Uno', 'San José', 'San José', 'San José', 'Calle 1, Casa 2', 1),
(16, 'Proveedor Dos', 'Alajuela', 'Alajuela', 'Alajuela', 'Avenida 2, Edificio 3', 0),
(17, 'Proveedor Tres', 'Cartago', 'Cartago', 'Cartago', 'Calle 3, Local 4', 1),
(18, 'Proveedor Cuatro', 'Heredia', 'Heredia', 'Heredia', 'Calle 4, Apartamento 5', 1),
(19, 'Proveedor Cinco', 'Guanacaste', 'Liberia', 'Liberia', 'Calle 5, Casa 6', 1),
(20, 'Proveedor Seis', 'Puntarenas', 'Puntarenas', 'Puntarenas', 'Calle 6, Local 7', 1),
(21, 'Proveedor Siete', 'Limón', 'Limón', 'Limón', 'Avenida 7, Edificio 8', 1),
(22, 'Proveedor Ocho', 'San José', 'Escazú', 'Escazú', 'Calle 8, Casa 9', 0),
(23, 'Proveedor Nueve', 'Alajuela', 'Grecia', 'Grecia', 'Avenida 9, Casa 10', 1),
(24, 'Proveedor Diez', 'Cartago', 'Turrialba', 'Turrialba', 'Calle 10, Local 11', 1),
(25, 'Proveedor Once', 'Heredia', 'Barva', 'Barva', 'Calle 11, Apartamento 12', 1),
(26, 'Proveedor Doce', 'Guanacaste', 'Nicoya', 'Nicoya', 'Calle 12, Casa 13', 1),
(27, 'Proveedor Trece', 'Puntarenas', 'Quepos', 'Quepos', 'Calle 13, Local 14', 1),
(28, 'Proveedor Catorce', 'Limón', 'Puerto Viejo', 'Puerto Viejo', 'Avenida 14, Edificio 15', 1),
(29, 'Proveedor Quince', 'San José', 'Alajuelita', 'Alajuelita', 'Calle 15, Casa 16', 1),
(30, 'Proveedor Dieciséis', 'Alajuela', 'San Ramón', 'San Ramón', 'Avenida 16, Casa 17', 1),
(31, 'Proveedor Diecisiete', 'Cartago', 'Oreamuno', 'Oreamuno', 'Calle 17, Local 18', 1),
(32, 'Proveedor Dieciocho', 'Heredia', 'Santo Domingo', 'Santo Domingo', 'Calle 18, Apartamento 19', 1),
(33, 'Proveedor Diecinueve', 'Guanacaste', 'Cañas', 'Cañas', 'Calle 19, Casa 20', 1),
(34, 'Proveedor Veinte', 'Puntarenas', 'San Isidro', 'San Isidro', 'Avenida 20, Edificio 21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sigm_puesto_trabajo`
--

CREATE TABLE `sigm_puesto_trabajo` (
  `ID_PUESTO_TRABAJO` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `DSC_PUESTO_TRABAJO` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_puesto_trabajo`
--

INSERT INTO `sigm_puesto_trabajo` (`ID_PUESTO_TRABAJO`, `DSC_NOMBRE`, `DSC_PUESTO_TRABAJO`, `ESTADO`) VALUES
(1, 'Gerente', 'Encargado del departamento de desarrollo, es quien vela por que el funcionamiento de dicho departamento sea el adecuado.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sigm_rol`
--

CREATE TABLE `sigm_rol` (
  `ID_ROL` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(50) NOT NULL,
  `DSC_ROL` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_rol`
--

INSERT INTO `sigm_rol` (`ID_ROL`, `DSC_NOMBRE`, `DSC_ROL`) VALUES
(1, 'Administrador', 'Usuario con acceso total al sistema, es capaz de administrar todo lo que hay en el.'),
(2, 'Asistente', 'Tiene acceso solo a las funcionalidades administrativas que respectan a la gestión del inventario');

-- --------------------------------------------------------

--
-- Table structure for table `sigm_usuario`
--

CREATE TABLE `sigm_usuario` (
  `ID_USUARIO` int(11) NOT NULL,
  `ID_COLABORADOR` int(11) DEFAULT NULL,
  `DSC_NOMBRE` varchar(255) DEFAULT NULL,
  `ID_ROL` int(11) DEFAULT NULL,
  `DSC_PASSWORD` varchar(255) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_usuario`
--

INSERT INTO `sigm_usuario` (`ID_USUARIO`, `ID_COLABORADOR`, `DSC_NOMBRE`, `ID_ROL`, `DSC_PASSWORD`, `ESTADO`) VALUES
(1, 1, 'AdamAG124', 1, '$2b$10$RwK/N7hKAkrRLnuPvg9Yje60fZeAcbz9Ba5UyniqdQ/U0cQAn/kwy', 1),
(2, 2, 'KaroVG1622', 2, '$2b$10$wwGRKKQ4hqFqbFiytxhUgOuGV0UQJE6EagcKkEYCTctl27IwZgsLS', 1),
(3, 4, 'JGB17', 1, '$2b$10$Bq/utgl.m/QtOxwfXSVBfudNToyLTtlqpXUhrAGtAkGEHUHh1GP5q', 1),
(4, 5, 'MLR18', 2, '$2b$10$mp1OHl9kcJymnCDXpKpHBeClAQaa2s4F1yT8Uj.u2P7nEOktENdm.', 0);

-- --------------------------------------------------------

--
-- Table structure for table `sigt_factura_producto`
--

CREATE TABLE `sigt_factura_producto` (
  `ID_FACTURA_PRODUCTO` int(11) NOT NULL,
  `ID_FACTURA` int(11) DEFAULT NULL,
  `ID_PRODUCTO` int(11) DEFAULT NULL,
  `NUM_CANTIDAD_ANTERIOR` double DEFAULT NULL,
  `NUM_CANTIDAD_ENTRANDO` double DEFAULT NULL,
  `MONTO_PRECIO_NUEVA` double DEFAULT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigt_salida`
--

CREATE TABLE `sigt_salida` (
  `ID_SALIDA` int(11) NOT NULL,
  `ID_COLABORADOR_SACANDO` int(11) DEFAULT NULL,
  `ID_COLABORADOR_RECIBIENDO` int(11) DEFAULT NULL,
  `FEC_SALIDA` datetime DEFAULT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sigt_salida_producto`
--

CREATE TABLE `sigt_salida_producto` (
  `ID_SALIDA_PRODUCTO` int(11) NOT NULL,
  `ID_PRODUCTO` int(11) DEFAULT NULL,
  `ID_SALIDA` int(11) DEFAULT NULL,
  `NUM_CANTIDAD_ANTERIOR` double DEFAULT NULL,
  `NUM_CANTIDAD_SALIENDO` double DEFAULT NULL,
  `NUM_CANTIDAD_NUEVA` double DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sigm_categoria_producto`
--
ALTER TABLE `sigm_categoria_producto`
  ADD PRIMARY KEY (`ID_CATEGORIA_PRODUCTO`);

--
-- Indexes for table `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  ADD PRIMARY KEY (`ID_COLABORADOR`),
  ADD KEY `ID_DEPARTAMENTO` (`ID_DEPARTAMENTO`),
  ADD KEY `ID_PUESTO` (`ID_PUESTO`);

--
-- Indexes for table `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  ADD PRIMARY KEY (`ID_COMPROBANTE_PAGO`),
  ADD KEY `ID_ENTIDAD_FINANCIERA` (`ID_ENTIDAD_FINANCIERA`);

--
-- Indexes for table `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  ADD PRIMARY KEY (`ID_CUENTA_BANCARIA`),
  ADD KEY `ID_ENTIDAD_FINANCIERA` (`ID_ENTIDAD_FINANCIERA`);

--
-- Indexes for table `sigm_departamento`
--
ALTER TABLE `sigm_departamento`
  ADD PRIMARY KEY (`ID_DEPARTAMENTO`);

--
-- Indexes for table `sigm_entidad_financiera`
--
ALTER TABLE `sigm_entidad_financiera`
  ADD PRIMARY KEY (`ID_ENTIDAD_FINANCIERA`);

--
-- Indexes for table `sigm_factura`
--
ALTER TABLE `sigm_factura`
  ADD PRIMARY KEY (`ID_FACTURA`),
  ADD KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  ADD KEY `ID_COMPROBANTE_PAGO` (`ID_COMPROBANTE_PAGO`);

--
-- Indexes for table `sigm_producto`
--
ALTER TABLE `sigm_producto`
  ADD PRIMARY KEY (`ID_PRODUCTO`),
  ADD KEY `ID_CATEGORIA_PRODUCTO` (`ID_CATEGORIA_PRODUCTO`);

--
-- Indexes for table `sigm_proveedor`
--
ALTER TABLE `sigm_proveedor`
  ADD PRIMARY KEY (`ID_PROVEEDOR`);

--
-- Indexes for table `sigm_puesto_trabajo`
--
ALTER TABLE `sigm_puesto_trabajo`
  ADD PRIMARY KEY (`ID_PUESTO_TRABAJO`);

--
-- Indexes for table `sigm_rol`
--
ALTER TABLE `sigm_rol`
  ADD PRIMARY KEY (`ID_ROL`);

--
-- Indexes for table `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD UNIQUE KEY `ID_COLABORADOR` (`ID_COLABORADOR`),
  ADD KEY `ID_ROL` (`ID_ROL`);

--
-- Indexes for table `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  ADD PRIMARY KEY (`ID_FACTURA_PRODUCTO`),
  ADD KEY `ID_FACTURA` (`ID_FACTURA`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indexes for table `sigt_salida`
--
ALTER TABLE `sigt_salida`
  ADD PRIMARY KEY (`ID_SALIDA`),
  ADD KEY `ID_COLABORADOR_SACANDO` (`ID_COLABORADOR_SACANDO`),
  ADD KEY `ID_COLABORADOR_RECIBIENDO` (`ID_COLABORADOR_RECIBIENDO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indexes for table `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  ADD PRIMARY KEY (`ID_SALIDA_PRODUCTO`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  ADD KEY `ID_SALIDA` (`ID_SALIDA`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sigm_categoria_producto`
--
ALTER TABLE `sigm_categoria_producto`
  MODIFY `ID_CATEGORIA_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  MODIFY `ID_COLABORADOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  MODIFY `ID_COMPROBANTE_PAGO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  MODIFY `ID_CUENTA_BANCARIA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_departamento`
--
ALTER TABLE `sigm_departamento`
  MODIFY `ID_DEPARTAMENTO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sigm_entidad_financiera`
--
ALTER TABLE `sigm_entidad_financiera`
  MODIFY `ID_ENTIDAD_FINANCIERA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_factura`
--
ALTER TABLE `sigm_factura`
  MODIFY `ID_FACTURA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_producto`
--
ALTER TABLE `sigm_producto`
  MODIFY `ID_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_proveedor`
--
ALTER TABLE `sigm_proveedor`
  MODIFY `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `sigm_puesto_trabajo`
--
ALTER TABLE `sigm_puesto_trabajo`
  MODIFY `ID_PUESTO_TRABAJO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sigm_rol`
--
ALTER TABLE `sigm_rol`
  MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  MODIFY `ID_FACTURA_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigt_salida`
--
ALTER TABLE `sigt_salida`
  MODIFY `ID_SALIDA` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  MODIFY `ID_SALIDA_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sigm_colaborador`
--
ALTER TABLE `sigm_colaborador`
  ADD CONSTRAINT `SIGM_COLABORADOR_ibfk_1` FOREIGN KEY (`ID_DEPARTAMENTO`) REFERENCES `sigm_departamento` (`ID_DEPARTAMENTO`),
  ADD CONSTRAINT `SIGM_COLABORADOR_ibfk_2` FOREIGN KEY (`ID_PUESTO`) REFERENCES `sigm_puesto_trabajo` (`ID_PUESTO_TRABAJO`);

--
-- Constraints for table `sigm_comprobante_pago`
--
ALTER TABLE `sigm_comprobante_pago`
  ADD CONSTRAINT `SIGM_COMPROBANTE_PAGO_ibfk_1` FOREIGN KEY (`ID_ENTIDAD_FINANCIERA`) REFERENCES `sigm_entidad_financiera` (`ID_ENTIDAD_FINANCIERA`);

--
-- Constraints for table `sigm_cuenta_bancaria`
--
ALTER TABLE `sigm_cuenta_bancaria`
  ADD CONSTRAINT `SIGM_CUENTA_BANCARIA_ibfk_1` FOREIGN KEY (`ID_ENTIDAD_FINANCIERA`) REFERENCES `sigm_entidad_financiera` (`ID_ENTIDAD_FINANCIERA`);

--
-- Constraints for table `sigm_factura`
--
ALTER TABLE `sigm_factura`
  ADD CONSTRAINT `SIGM_FACTURA_ibfk_1` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `sigm_proveedor` (`ID_PROVEEDOR`),
  ADD CONSTRAINT `SIGM_FACTURA_ibfk_2` FOREIGN KEY (`ID_COMPROBANTE_PAGO`) REFERENCES `sigm_comprobante_pago` (`ID_COMPROBANTE_PAGO`);

--
-- Constraints for table `sigm_producto`
--
ALTER TABLE `sigm_producto`
  ADD CONSTRAINT `SIGM_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_CATEGORIA_PRODUCTO`) REFERENCES `sigm_categoria_producto` (`ID_CATEGORIA_PRODUCTO`);

--
-- Constraints for table `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  ADD CONSTRAINT `SIGM_USUARIO_ibfk_1` FOREIGN KEY (`ID_COLABORADOR`) REFERENCES `sigm_colaborador` (`ID_COLABORADOR`),
  ADD CONSTRAINT `SIGM_USUARIO_ibfk_2` FOREIGN KEY (`ID_ROL`) REFERENCES `sigm_rol` (`ID_ROL`);

--
-- Constraints for table `sigt_factura_producto`
--
ALTER TABLE `sigt_factura_producto`
  ADD CONSTRAINT `SIGT_FACTURA_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_FACTURA`) REFERENCES `sigm_factura` (`ID_FACTURA`),
  ADD CONSTRAINT `SIGT_FACTURA_PRODUCTO_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `sigm_producto` (`ID_PRODUCTO`),
  ADD CONSTRAINT `SIGT_FACTURA_PRODUCTO_ibfk_3` FOREIGN KEY (`ID_USUARIO`) REFERENCES `sigm_usuario` (`ID_USUARIO`);

--
-- Constraints for table `sigt_salida`
--
ALTER TABLE `sigt_salida`
  ADD CONSTRAINT `SIGT_SALIDA_ibfk_1` FOREIGN KEY (`ID_COLABORADOR_SACANDO`) REFERENCES `sigm_colaborador` (`ID_COLABORADOR`),
  ADD CONSTRAINT `SIGT_SALIDA_ibfk_2` FOREIGN KEY (`ID_COLABORADOR_RECIBIENDO`) REFERENCES `sigm_colaborador` (`ID_COLABORADOR`),
  ADD CONSTRAINT `SIGT_SALIDA_ibfk_3` FOREIGN KEY (`ID_USUARIO`) REFERENCES `sigm_usuario` (`ID_USUARIO`);

--
-- Constraints for table `sigt_salida_producto`
--
ALTER TABLE `sigt_salida_producto`
  ADD CONSTRAINT `SIGT_SALIDA_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `sigm_producto` (`ID_PRODUCTO`),
  ADD CONSTRAINT `SIGT_SALIDA_PRODUCTO_ibfk_2` FOREIGN KEY (`ID_SALIDA`) REFERENCES `sigt_salida` (`ID_SALIDA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
