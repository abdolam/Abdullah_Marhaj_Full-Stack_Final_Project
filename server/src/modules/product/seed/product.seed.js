import Product from "../models/product.model.js";

export async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log("[seed] products: already present -> skipping");
      return;
    }

    console.log("[seed] Products collection empty -> seeding defaults...");

    const products = [
      {
        name: "בקבוק מים רב פעמי מנירוסטה",
        shortDescription: "בקבוק שתייה אקולוגי לשימוש יומיומי",
        description: "בקבוק שתייה אקולוגי מנירוסטה לשימוש יומיומי.",
        price: 79.9,
        image: "https://images.unsplash.com/photo-1526401485004-2aa7c0aa0b07",
        category: "מטבח",
        isActive: true,
      },
      {
        name: "שקית בד רב פעמית",
        shortDescription: "שקית בד חזקה לקניות",
        description: "שקית בד חזקה לקניות ולשימוש חוזר.",
        price: 24.9,
        image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780",
        category: "בית",
        isActive: true,
      },
      {
        name: "מברשת שיניים במבוק",
        shortDescription: "חלופה ידידותית לסביבה",
        description: "מברשת שיניים מבמבוק כחלופה ידידותית לסביבה.",
        price: 14.9,
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f3",
        category: "טיפוח",
        isActive: true,
      },
      {
        name: "קופסת אוכל אקולוגית מזכוכית",
        shortDescription: "קופסה אטומה לשימוש יומיומי",
        description:
          "קופסת אוכל מזכוכית מחוסמת עם מכסה אטום, מתאימה לשימוש יומיומי ולחימום במיקרוגל.",
        price: 49.9,
        image: "https://images.unsplash.com/photo-1604908554164-0a2b0d1c3e1b",
        category: "מטבח",
        isActive: true,
      },
      {
        name: "כוס קפה רב פעמית",
        shortDescription: "כוס עם בידוד תרמי",
        description:
          "כוס קפה רב פעמית עם בידוד תרמי, שומרת על חום המשקה ומפחיתה שימוש בכוסות חד פעמיות.",
        price: 34.9,
        image: "https://images.unsplash.com/photo-1517705008128-361805f42e86",
        category: "שתייה",
        isActive: true,
      },
      {
        name: "סט קשיות נירוסטה רב פעמיות",
        shortDescription: "כולל מברשת ניקוי",
        description:
          "סט קשיות מנירוסטה לשימוש חוזר, כולל מברשת ניקוי. פתרון אקולוגי ונוח.",
        price: 19.9,
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
        category: "אביזרים",
        isActive: true,
      },
    ];

    await Product.insertMany(products);
    console.log(`[seed] products: inserted ${products.length} products`);
  } catch (error) {
    console.error("[seed] products: failed", error);
    throw error;
  }
}
