## Storage Systems

To support the hospital’s four goals, we’ve selected a hybrid storage strategy combining a data lake, data warehouse, and real-time streaming systems:

- **Predicting patient readmission risk** requires access to large volumes of historical treatment data. We use a **Data Lake** (e.g., Azure Data Lake or Amazon S3) to store raw EHR, EMR, and lab reports. This format supports flexible schema evolution and is ideal for training machine learning models.

- **Natural language queries by doctors** rely on structured, indexed data. We use a **Data Warehouse** (e.g., Snowflake or Google BigQuery) to store cleaned and normalized patient records. This enables fast joins and semantic search via an NLP engine.

- **Monthly management reports** (e.g., bed occupancy, department-wise costs) are generated from the **Data Warehouse**, which aggregates structured data from multiple departments. This supports OLAP-style queries and dashboarding tools like Power BI or Tableau.

- **Real-time ICU vitals** are streamed into a **Streaming Analytics System** (e.g., Apache Kafka + Apache Flink or Azure Stream Analytics). These vitals are stored in a time-series database (e.g., InfluxDB or TimescaleDB) for immediate alerting and retrospective analysis.

This layered approach ensures each goal is matched with the most appropriate storage system, balancing flexibility, performance, and scalability.

---

## OLTP vs OLAP Boundary

The boundary between OLTP (Online Transaction Processing) and OLAP (Online Analytical Processing) is clearly defined in our architecture:

- **OLTP ends at the data ingestion layer.** This includes real-time vitals from ICU devices, transactional updates to patient records, and incoming doctor queries. These systems prioritize speed, reliability, and atomicity.

- **OLAP begins at the storage and analytics layer.** Once data is ingested and transformed, it flows into the data lake and warehouse. Here, it’s used for batch analytics, predictive modeling, and reporting. This layer supports complex queries, aggregations, and historical analysis.

This separation ensures transactional systems remain fast and responsive, while analytical systems handle heavy computation without impacting operational performance.

---

## Trade-offs

A key trade-off in this design is the **latency between ingestion and analytics**. Real-time vitals are streamed instantly, but historical treatment data and monthly reports rely on batch ETL processes, which can introduce delays.

This affects use cases like predicting readmission risk in near real-time or generating up-to-the-minute occupancy reports.

To mitigate this:
- We implement **micro-batching** for ETL pipelines, reducing latency from hours to minutes.
- We use **streaming joins and incremental updates** in the data warehouse to keep dashboards fresh.
- For critical alerts (e.g., ICU vitals), we bypass batch layers entirely and use real-time processing engines.

This hybrid strategy balances performance with accuracy, ensuring timely insights without overwhelming the system.
