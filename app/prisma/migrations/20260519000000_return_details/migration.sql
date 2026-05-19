ALTER TABLE `reservas`
  MODIFY `processo` VARCHAR(5) NULL,
  ADD COLUMN `proposta` INTEGER NULL,
  ADD COLUMN `descricao` VARCHAR(250) NULL;
