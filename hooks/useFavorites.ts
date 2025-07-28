import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../config/axios";
import { FavoriteMosque } from "../types/favMosque";

const QUERY_KEYS = {
  favoriteStatus: (userId?: string) => ["favorites-status", userId],
  favoriteMosques: (userId?: string) => ["favorites-mosques", userId],
} as const;
