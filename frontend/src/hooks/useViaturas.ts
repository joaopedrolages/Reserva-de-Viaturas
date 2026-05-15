import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createViatura, fetchViaturas } from '../services/viaturas.service';

export function useViaturas() {
  return useQuery({
    queryKey: ['viaturas'],
    queryFn: fetchViaturas,
  });
}

export function useCreateViatura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createViatura,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['viaturas'] });
    },
  });
}
