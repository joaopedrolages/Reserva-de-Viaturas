CREATE TABLE `viaturas` (
  `ID` INTEGER NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(100) NOT NULL,

  PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `reservas` (
  `ID` INTEGER NOT NULL AUTO_INCREMENT,
  `IDViatura` INTEGER NOT NULL,
  `NomeCondutor` VARCHAR(100) NOT NULL,
  `DataInicio` DATETIME(3) NOT NULL,
  `DataFim` DATETIME(3) NOT NULL,
  `km` INTEGER NULL,
  `processo` TEXT NULL,
  `datafimreal` DATETIME(3) NULL,

  INDEX `reservas_IDViatura_idx` (`IDViatura`),
  INDEX `reservas_IDViatura_DataInicio_DataFim_idx` (`IDViatura`, `DataInicio`, `DataFim`),
  PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_IDViatura_fkey`
  FOREIGN KEY (`IDViatura`) REFERENCES `viaturas`(`ID`)
  ON DELETE CASCADE ON UPDATE CASCADE;
