-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2025 at 04:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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

--
-- Dumping data for table `sigm_categoria_producto`
--


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

--
-- Dumping data for table `sigm_comprobante_pa

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

--
-- Dumping data for table `sigm_cuenta_bancaria`
--



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


-- --------------------------------------------------------

--
-- Table structure for table `sigm_entidad_financiera`
--

CREATE TABLE `sigm_entidad_financiera` (
  `ID_ENTIDAD_FINANCIERA` int(11) NOT NULL,
  `DSC_NOMBRE_ENTIDAD_FINANCIERA` varchar(255) DEFAULT NULL,
  `DSC_TELEFONO_ENTIDAD_FINANCIERA` varchar(50) DEFAULT NULL,
  `DSC_CORREO_ENTIDAD_FINANCIERA` varchar(100) DEFAULT NULL,
  `TIPO_ENTIDAD_FINANCIERA` varchar(25) DEFAULT NULL,
  `FEC_INICIO_FINANCIAMIENTO` date DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigm_entidad_financiera`


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

--
-- Dumping data for table `sigm_factura`
--


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
  `ID_UNIDAD_MEDICION` int(11) NOT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

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
-- Table structure for table `sigm_unidad_medicion`
--

CREATE TABLE `sigm_unidad_medicion` (
  `ID_UNIDAD_MEDICION` int(11) NOT NULL,
  `DSC_NOMBRE` varchar(50) NOT NULL,
  `ESTADO` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sigm_unidad_medicion`
--


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

--

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
  `DSC_DETALLE_SALIDA` text DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sigt_salida`
-
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
-- Dumping data for table `sigt_salida_producto`
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
  ADD KEY `ID_CATEGORIA_PRODUCTO` (`ID_CATEGORIA_PRODUCTO`),
  ADD KEY `ID_UNIDAD_MEDICION` (`ID_UNIDAD_MEDICION`) USING BTREE;

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
-- Indexes for table `sigm_unidad_medicion`
--
ALTER TABLE `sigm_unidad_medicion`
  ADD PRIMARY KEY (`ID_UNIDAD_MEDICION`);

--
-- Indexes for table `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD UNIQUE KEY `ID_COLABORADOR` (`ID_COLABORADOR`),
  ADD UNIQUE KEY `DSC_NOMBRE` (`DSC_NOMBRE`),
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
  MODIFY `ID_COLABORADOR` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ID_DEPARTAMENTO` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ID_PROVEEDOR` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_puesto_trabajo`
--
ALTER TABLE `sigm_puesto_trabajo`
  MODIFY `ID_PUESTO_TRABAJO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_rol`
--
ALTER TABLE `sigm_rol`
  MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sigm_unidad_medicion`
--
ALTER TABLE `sigm_unidad_medicion`
  MODIFY `ID_UNIDAD_MEDICION` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sigm_usuario`
--
ALTER TABLE `sigm_usuario`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `SIGM_PRODUCTO_ibfk_1` FOREIGN KEY (`ID_CATEGORIA_PRODUCTO`) REFERENCES `sigm_categoria_producto` (`ID_CATEGORIA_PRODUCTO`),
  ADD CONSTRAINT `SIGM_PRODUCTO_ibfk_2` FOREIGN KEY (`ID_UNIDAD_MEDICION`) REFERENCES `sigm_unidad_medicion` (`ID_UNIDAD_MEDICION`);

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
