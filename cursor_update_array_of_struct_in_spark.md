# Update array of struct in Spark
_Exported on 29/06/2025 at 18:45:37 GMT+5:30 from Cursor (0.50.5)_

---

**User**

how to update array of struct  in spark. 
Here , when I am trying to update , new array is getting created and if I have same value in the data , array is getting duplicated . 
I want to update the struck without getting any duplicates or creating a new array. I want the same array of struct to get updated. How do i achieve this for the code snippit which is in the screnshoots.  

---

**Cursor**

You are facing a common issue in Spark DataFrame transformations: when updating an array of structs, your logic is creating a new array, and if the same value is present, it gets duplicated. You want to **update the struct in-place** (i.e., update only the matching struct in the array, without duplicating or creating a new array).

Let's break down the solution for Spark (Scala/Java API, as per your code):

---

## Problem Recap

- You have a column that is an **array of structs**.
- You want to update a field in a struct **only if it matches a condition** (e.g., `masterContractId` matches).
- You want to **avoid duplicating structs** or creating a new array with duplicates.

---

## Solution Approach

You need to:
1. **Map over the array of structs** using `transform` (in Spark SQL or DataFrame API).
2. **Update only the matching struct** (using `when`/`otherwise` or `if` logic).
3. **Return the original struct for non-matching elements**.

### Spark SQL Expression (for reference)
```sql
transform(arrayCol, x -> 
  IF(x.masterContractId = 'SOME_ID', 
     named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), 
     x
  )
)
```

### DataFrame API (Java/Scala)
You can use `functions.expr` or `functions.transform` (since Spark 3.1+):

#### Example in Scala (can be adapted to Java)
```scala
import org.apache.spark.sql.functions._

val updatedDf = df.withColumn(
  "arrayCol",
  expr("""
    transform(arrayCol, x -> 
      IF(x.masterContractId = 'SOME_ID', 
         named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), 
         x
      )
    )
  """)
)
```

#### In Java (using `functions.expr`)
```java
import static org.apache.spark.sql.functions.*;

df.withColumn(
  "arrayCol",
  expr("transform(arrayCol, x -> IF(x.masterContractId = 'SOME_ID', named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), x))")
);
```

---

## How to Integrate with Your Code

Looking at your code snippet, you are building columns using `array`, `when`, and `otherwise`.  
**Instead, use the `transform` function** to update only the matching struct.

### Example for Your Use Case

Suppose your array column is `structArrayFields`, and you want to update the `weight` field for a specific `masterContractId`:

```java
import static org.apache.spark.sql.functions.*;

df.withColumn(
  "structArrayFields",
  expr("transform(structArrayFields, x -> IF(x.masterContractId = 'RISK_UNDERLYING_LEG1', named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), x))")
);
```

- Replace `'RISK_UNDERLYING_LEG1'` and `'NEW_WEIGHT'` with your actual values or variables.

---

## Key Points

- **transform** lets you update elements in an array without duplicating or creating a new array.
- Only the matching struct is updated; others remain unchanged.
- No duplicates are introduced.

---

## If You Need to Do This in Java Code (not SQL string)

You can use the `functions.transform` method (Spark 3.1+):

```java
import org.apache.spark.sql.Column;
import static org.apache.spark.sql.functions.*;

Column updatedArray = transform(
    col("structArrayFields"),
    x -> when(x.getField("masterContractId").equalTo(lit("RISK_UNDERLYING_LEG1")),
              struct(
                  x.getField("masterContractId").alias("masterContractId"),
                  lit("NEW_WEIGHT").alias("weight")
              )
          ).otherwise(x)
);

df.withColumn("structArrayFields", updatedArray);
```

---

## Summary

- **Use `transform` to map and update only the matching struct.**
- **Do not use `array` or `array_union` for updates, as they can introduce duplicates.**
- **Return the original struct for non-matching elements.**

If you share your exact update logic or the field you want to update, I can provide a more tailored code snippet for your case!

```sql
transform(arrayCol, x -> 
  IF(x.masterContractId = 'SOME_ID', 
     named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), 
     x
  )
)
```

```plaintext
import org.apache.spark.sql.functions._

val updatedDf = df.withColumn(
  "arrayCol",
  expr("""
    transform(arrayCol, x -> 
      IF(x.masterContractId = 'SOME_ID', 
         named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), 
         x
      )
    )
  """)
)
```

```java
import static org.apache.spark.sql.functions.*;

df.withColumn(
  "arrayCol",
  expr("transform(arrayCol, x -> IF(x.masterContractId = 'SOME_ID', named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), x))")
);
```

```java
import static org.apache.spark.sql.functions.*;

df.withColumn(
  "structArrayFields",
  expr("transform(structArrayFields, x -> IF(x.masterContractId = 'RISK_UNDERLYING_LEG1', named_struct('masterContractId', x.masterContractId, 'weight', 'NEW_WEIGHT'), x))")
);
```

```java
import org.apache.spark.sql.Column;
import static org.apache.spark.sql.functions.*;

Column updatedArray = transform(
    col("structArrayFields"),
    x -> when(x.getField("masterContractId").equalTo(lit("RISK_UNDERLYING_LEG1")),
              struct(
                  x.getField("masterContractId").alias("masterContractId"),
                  lit("NEW_WEIGHT").alias("weight")
              )
          ).otherwise(x)
);

df.withColumn("structArrayFields", updatedArray);
```


return expr(
    "transform(" + primaryCol.toString() + ", x -> " +
        "CASE " +
            "WHEN x.legId = 'leg1' THEN named_struct('legId', x.legId, 'masterContractId', 'NEW_ID1', 'weight', 'NEW_WEIGHT1') " +
            "WHEN x.legId = 'leg2' THEN named_struct('legId', x.legId, 'masterContractId', 'NEW_ID2', 'weight', 'NEW_WEIGHT2') " +
            "ELSE x END" +
    ")"
);

