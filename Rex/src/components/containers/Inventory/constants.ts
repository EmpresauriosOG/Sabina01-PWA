export enum IngredientType {
  condimento = "condimento",
  otro = "otro",
  fruta = "fruta",
  verdura = "verdura",
  origenAnimal = "origenAnimal",
  liquido = "liquido",
}
export enum UnitType {
  gr = "gr",
  oz = "oz",
  kg = "kg",
  unidad = "unidad",
  lt = "lt",
  otro = "otro",
}

export const IngredientTypeOptions = [
  IngredientType.condimento,
  IngredientType.otro,
  IngredientType.fruta,
  IngredientType.verdura,
  IngredientType.origenAnimal,
  IngredientType.liquido,
];
export const UnitTypeOptions = [
  UnitType.gr,
  UnitType.oz,
  UnitType.kg,
  UnitType.unidad,
  UnitType.lt,
  UnitType.otro,
];

// Compare this snippet from Rex/src/components/tables/Ingredients/Ingredients.tsx:
