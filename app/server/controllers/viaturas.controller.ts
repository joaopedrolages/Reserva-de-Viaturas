import type { RequestHandler } from 'express';
import { viaturasService } from '../services/viaturas.service';

export const listViaturas: RequestHandler = async (_req, res) => {
  const viaturas = await viaturasService.list();
  res.json(viaturas);
};

export const createViatura: RequestHandler = async (req, res) => {
  const viatura = await viaturasService.create(req.body);
  res.status(201).json(viatura);
};
