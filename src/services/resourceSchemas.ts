// Auto-generated table schemas for all resources (with i18n labels)

export const tableSchemas = {
  material: [
    { key: "id", label: "material.id" },
    { key: "brand", label: "material.brand" },
    { key: "dense", label: "material.dense" },
    { key: "hardness", label: "material.hardness" },
    { key: "tear_resistance", label: "material.tear_resistance" },
    { key: "elongation", label: "material.elongation" },
    { key: "category.name", label: "material.category" }
  ],
  material_category: [
    { key: "id", label: "material_category.id" },
    { key: "name", label: "material_category.name" },
    { key: "material_type", label: "material_category.material_type" }
  ],
  operation_type: [
    { key: "id", label: "operation_type.id" },
    { key: "name", label: "operation_type.name" }
  ],
  method: [
    { key: "id", label: "method.id" },
    { key: "name", label: "method.name" },
    { key: "operation_type_id", label: "method.operation_type_id" }
  ],
  machine_type: [
    { key: "id", label: "machine_type.id" },
    { key: "name", label: "machine_type.name" },
    { key: "method_id", label: "machine_type.method_id" }
  ],
  machine: [
    { key: "id", label: "machine.id" },
    { key: "name", label: "machine.name" },
    { key: "machine_type_id", label: "machine.machine_type_id" },
    { key: "count", label: "machine.count" },
    { key: "X", label: "machine.X" },
    { key: "Y", label: "machine.Y" },
    { key: "Z", label: "machine.Z" },
    { key: "H", label: "machine.H" },
    { key: "D", label: "machine.D" }
  ],
  tooling: [
    { key: "id", label: "tooling.id" },
    { key: "name", label: "tooling.name" },
    { key: "mark", label: "tooling.mark" },
    { key: "gost", label: "tooling.gost" },
    { key: "machine_id", label: "tooling.machine_id" },
    { key: "h_d_foot", label: "tooling.h_d_foot" },
    { key: "B", label: "tooling.B" },
    { key: "L", label: "tooling.L" },
    { key: "A", label: "tooling.A" },
    { key: "h_d", label: "tooling.h_d" }
  ],
  tool: [
    { key: "id", label: "tool.id" },
    { key: "name", label: "tool.name" },
    { key: "mark", label: "tool.mark" },
    { key: "gost", label: "tool.gost" },
    { key: "machine_id", label: "tool.machine_id" },
    { key: "K_H_D", label: "tool.K_H_D" },
    { key: "alpha_B_d", label: "tool.alpha_B_d" },
    { key: "L", label: "tool.L" },
    { key: "I_max_cut", label: "tool.I_max_cut" },
    { key: "S", label: "tool.S" }
  ],
  gost: [
    { key: "id", label: "gost.id" },
    { key: "number", label: "gost.number" }
  ],
  assortment_type: [
    { key: "id", label: "assortment_type.id" },
    { key: "name", label: "assortment_type.name" }
  ],
  gost_assortment: [
    { key: "id", label: "gost_assortment.id" },
    { key: "gost.number", label: "gost_assortment.gost" },
    { key: "assortment_type.name", label: "gost_assortment.assortment_type" }
  ],
  assortment: [
    { key: "id", label: "assortment.id" },
    { key: "gost_assortment_model.gost.number", label: "assortment.gost" },
    { key: "B_D", label: "assortment.B_D" },
    { key: "height", label: "assortment.height" },
    { key: "strength", label: "assortment.strength" },
    { key: "length", label: "assortment.length" }
  ]
} as const;
