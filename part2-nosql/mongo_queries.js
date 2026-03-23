// ============================================================
// Part 2 — MongoDB Operations (mongo_queries.js)
// ============================================================

// OP1: insertMany() — insert all 3 documents from sample_documents.json
db.products.insertMany([
  {
    _id: "prod_elec_001",
    category: "Electronics",
    product_name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    sku: "SONY-WH1000XM5-BLK",
    price: 29990,
    currency: "INR",
    stock_quantity: 145,
    in_stock: true,
    warranty_years: 2,
    specifications: {
      type: "Over-Ear",
      connectivity: "Bluetooth 5.2",
      battery_life_hours: 30,
      noise_cancellation: true,
      voltage_compatibility: "5V DC (USB-C)",
      weight_grams: 250,
      color_options: ["Black", "Silver", "Midnight Blue"]
    },
    ratings: { average: 4.7, count: 3812 },
    tags: ["wireless", "noise-cancelling", "premium-audio", "work-from-home"],
    created_at: new Date("2024-01-15T10:30:00Z")
  },
  {
    _id: "prod_cloth_001",
    category: "Clothing",
    product_name: "Men's Slim Fit Denim Jeans",
    brand: "Levi's",
    sku: "LEVIS-511-32W32L-INDIGO",
    price: 3499,
    currency: "INR",
    stock_quantity: 320,
    in_stock: true,
    warranty_years: null,
    specifications: {
      material: "98% Cotton, 2% Elastane",
      fit_type: "Slim Fit",
      rise: "Mid Rise",
      closure: "Zip Fly with Button",
      wash_instruction: "Machine wash cold, tumble dry low",
      sizes_available: ["28W", "30W", "32W", "34W", "36W"],
      color_options: ["Indigo Blue", "Black", "Stone Grey"]
    },
    gender: "Men",
    age_group: "Adult",
    ratings: { average: 4.3, count: 8941 },
    tags: ["casual", "denim", "everyday-wear", "slim-fit"],
    created_at: new Date("2024-02-20T08:00:00Z")
  },
  {
    _id: "prod_groc_001",
    category: "Groceries",
    product_name: "Aashirvaad Whole Wheat Atta 10kg",
    brand: "Aashirvaad",
    sku: "AASHIRVAAD-ATTA-10KG",
    price: 485,
    currency: "INR",
    stock_quantity: 890,
    in_stock: true,
    warranty_years: null,
    specifications: {
      weight_kg: 10,
      type: "Whole Wheat Flour",
      form: "Powder",
      storage: "Store in a cool dry place",
      shelf_life_days: 180,
      package_type: "Sealed Bag"
    },
    nutritional_info: {
      per_100g: {
        energy_kcal: 341,
        protein_g: 12.1,
        carbohydrates_g: 69.4,
        fat_g: 1.7,
        fibre_g: 11.0
      }
    },
    allergens: ["Gluten"],
    certifications: ["FSSAI Approved", "ISO 22000"],
    expiry_date: new Date("2025-09-30T00:00:00Z"),
    manufactured_date: new Date("2024-03-01T00:00:00Z"),
    ratings: { average: 4.5, count: 21456 },
    tags: ["staples", "flour", "whole-wheat", "daily-essentials"],
    created_at: new Date("2024-03-01T09:00:00Z")
  }
]);

// OP2: find() — retrieve all Electronics products with price > 20000
db.products.find(
  {
    category: "Electronics",
    price: { $gt: 20000 }
  },
  {
    product_name: 1,
    brand: 1,
    price: 1,
    category: 1,
    _id: 1
  }
);

// OP3: find() — retrieve all Groceries expiring before 2025-01-01
db.products.find(
  {
    category: "Groceries",
    expiry_date: { $lt: new Date("2025-01-01T00:00:00Z") }
  },
  {
    product_name: 1,
    brand: 1,
    expiry_date: 1,
    price: 1
  }
);

// OP4: updateOne() — add a "discount_percent" field to a specific product
db.products.updateOne(
  { _id: "prod_elec_001" },
  {
    $set: {
      discount_percent: 10,
      discounted_price: 26991
    }
  }
);

// OP5: createIndex() — create an index on category field and explain why
// Reason: The 'category' field is the most common filter in queries (OP2, OP3).
// Without an index, MongoDB performs a full collection scan for every
// category-based query — O(n) cost. With a single-field index on 'category',
// MongoDB uses an index scan, reducing lookup time to O.
// As the product catalog grows to thousands of documents, this index ensures
// category filters remain fast without scanning the entire collection.
db.products.createIndex(
  { category: 1 },
  { name: "idx_category_asc", background: true }
);

// Verify index was created
db.products.getIndexes();
