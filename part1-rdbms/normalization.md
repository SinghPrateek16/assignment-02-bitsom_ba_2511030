## Anomaly Analysis

The source file `orders_flat.csv` is fully denormalized flat file combining customer, product, sales representative, and order information in a single table. This structure introduces three classical data anomalies.

### Insert Anomaly

- **Insert Anomaly**: New products cannot be added unless tied to an order. Example: Product P004 in row ORD1027.
**Definition:** It is impossible to insert a new entity without also inserting an unrelated entity.


**Example from dataset:**
Suppose the company hires a new sales representative **SR05 — Rohit Brotia** (Rohit@gmail.com) based in a new delhi office. To record this representative in the flat table, a dummy order row must be created — because `sales_rep_id`, `sales_rep_name`, `sales_rep_email`, and `office_address` are only stored as attributes of an order. There is no standalone "sales rep" table. Similarly, a new product like **P009 — Whiteboard (Stationery, ₹1,500)** cannot be inserted without fabricating an order. The flat schema forces every entity to exist only in the context of an order.


---

### Update Anomaly

- **Update Anomaly**: Customer details repeated across rows. Example: Customer C002 (Priya Sharma) in ORD1027, ORD1002, ORD1037, ORD1054.
**Definition:** Updating a single logical fact requires modifying multiple rows, creating a risk of inconsistency.


**Example from dataset:**  
Sales representative **SR03 — Ravi Kumar** appears in dozens of rows. In rows `ORD1037`, `ORD1075`, `ORD1162`, `ORD1185`, and several others, the `office_address` for SR03 is stored as `"South Zone, MG Road, Bangalore - 560001"` — an abbreviated version — while in the majority of rows it is `"South Zone, MG Road, Bangalore - 560001"` . This inconsistency already exists in the raw data and demonstrates the classic update anomaly: if Deepak Joshi's office address changes, every row mentioning SR01 must be updated. Missed updates leave the data in an inconsistent state. The same pattern applies to any change in `customer_email` or `unit_price`.


---

### Delete Anomaly

- **Delete Anomaly**: Removing the only order of SalesRep SR03 (Ravi Kumar) deletes the rep record. Example: ORD1075.
**Definition:** Deleting one entity unintentionally destroys information about another unrelated entity.

**Example from dataset:**  
Customer ** Sneha Iyer ** (sneha@gmail.com , Chennai) placed order `ORD1076` for `P006 — Standing Desk`. If this single order row is deleted, the only record that product **P006 ** exists in the catalog may be lost because there is no independent `products` or `customers` table. More critically, any product with only one order would be entirely erased from the system upon cancellation or deletion of its sole order. Customer and product identity depends entirely on the existence of order rows.



---

## Normalization Justification

A manager might argue that keeping everything in one flat table — as in `orders_flat.csv` — is simpler and easier to query. While this view has surface appeal, the dataset itself provides compelling evidence against it.

Consider `sales_rep_id = SR01` (Deepak Joshi). His name, email, and office address are repeated across over 40 rows in the flat file. The office address already appears in two slightly different forms — `"Nariman Point"` and `"Nariman Pt"` — in rows like `ORD1091` versus `ORD1180`. This is not hypothetical danger; it is a real inconsistency that already exists in the data, caused directly by the denormalized structure.

Similarly, `unit_price` for `P001 (Laptop)` is stored in every single order row that contains a laptop. If the company revises the laptop price from ₹55,000 to ₹58,000, the team must update every matching row. Miss even one, and the historical data becomes unreliable — a direct update anomaly.

Normalization resolves these problems by decomposing the flat file into four tables: `customers`, `products`, `sales_reps`, and `orders`. Each fact is stored exactly once. The customer's email lives in `customers`, not repeated per order. The product price lives in `products`, not duplicated across hundreds of rows. A sales rep's office address is stored once in `sales_reps`. Changes require a single UPDATE, not a multi-row sweep.

The cost of normalization — slightly more complex JOIN queries — is minimal compared to the risks of data corruption, wasted storage, and inconsistent reporting. A reporting tool, ORM, or view can always abstract the joins. But once dirty data enters a flat file at scale, cleaning it is expensive and error-prone. The dataset's own inconsistencies prove that normalization is not over-engineering — it is essential data hygiene.

---
