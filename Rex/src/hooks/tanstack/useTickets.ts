import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTicket,
  fetchTickets,
  closeTicket,
} from "@/utils/ticketUtils";
import { useToast } from "@/components/ui/use-toast";

export const useTickets = (restaurant_id: string, location_id: string) => {
  return useQuery({
    queryKey: ["tickets", restaurant_id, location_id],
    queryFn: () => fetchTickets(restaurant_id, location_id),
    staleTime: 0,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (table_id: string) => createTicket(table_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({
        title: "Ticket creado",
        description: "El ticket se ha creado exitosamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear ticket",
        description: error.message || "Ocurrió un error al crear el ticket",
        variant: "destructive",
      });
    },
  });
};

export const useCloseTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (ticket_id: string) => closeTicket(ticket_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({
        title: "Ticket cerrado",
        description: "El ticket se ha cerrado exitosamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al cerrar ticket",
        description: error.message || "Ocurrió un error al cerrar el ticket",
        variant: "destructive",
      });
    },
  });
};
