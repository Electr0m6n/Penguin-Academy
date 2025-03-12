-- Añadir la columna is_competitive a la tabla existente
ALTER TABLE typing_scores 
ADD COLUMN is_competitive BOOLEAN NOT NULL DEFAULT false;

-- Crear índice para optimizar consultas
CREATE INDEX idx_typing_scores_competitive 
ON typing_scores (is_competitive);

-- Si deseas que todos los registros existentes tengan valor true (opcional)
-- UPDATE typing_scores SET is_competitive = true; 