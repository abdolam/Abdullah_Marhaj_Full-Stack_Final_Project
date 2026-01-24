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
        image:
          "https://img.freepik.com/free-photo/top-view-floating-water_23-2151013924.jpg?t=st=1769240108~exp=1769243708~hmac=82e2bb7ce9fa4a4f3077b2a775ae0c6a74c7ba5b5b16b6a7649a658e64168f2e&w=1480",
        category: "מטבח",
        isActive: true,
      },
      {
        name: "שקית בד רב פעמית",
        shortDescription: "שקית בד חזקה לקניות",
        description: "שקית בד חזקה לקניות ולשימוש חוזר.",
        price: 24.9,
        image:
          "https://img.freepik.com/free-photo/front-view-smiley-woman-with-bags_23-2149437298.jpg?t=st=1769240844~exp=1769244444~hmac=62d455a97347ba091c308a7996edab804306552d1d43214fb2367ceca5d4727c&w=1480",
        category: "בית",
        isActive: true,
      },
      {
        name: "מברשת שיניים במבוק",
        shortDescription: "חלופה ידידותית לסביבה",
        description: "מברשת שיניים מבמבוק כחלופה ידידותית לסביבה.",
        price: 14.9,
        image:
          "https://img.freepik.com/free-photo/natural-products-assortment-flat-lay_23-2149413916.jpg?t=st=1769240258~exp=1769243858~hmac=6f2010a30a6a9b3a96f1889b03defe37867e67a4ae8333d23e990d81526cb96c&w=1480",
        category: "טיפוח",
        isActive: true,
      },
      {
        name: "קופסת אוכל אקולוגית מזכוכית",
        shortDescription: "קופסה אטומה לשימוש יומיומי",
        description:
          "קופסת אוכל מזכוכית מחוסמת עם מכסה אטום, מתאימה לשימוש יומיומי ולחימום במיקרוגל.",
        price: 49.9,
        image:
          "https://img.freepik.com/free-photo/top-view-nutrition-food-meal-planning_23-2149074241.jpg?t=st=1769240611~exp=1769244211~hmac=04e374f0ab5428895c88aa52aba49ee8649505c88cf5968ea825a487667d2a37&w=1480",
        category: "מטבח",
        isActive: true,
      },
      {
        name: "כוס קפה רב פעמית",
        shortDescription: "כוס עם בידוד תרמי",
        description:
          "כוס קפה רב פעמית עם בידוד תרמי, שומרת על חום המשקה ומפחיתה שימוש בכוסות חד פעמיות.",
        price: 34.9,
        image:
          "https://img.freepik.com/free-photo/front-view-hand-held-cup_23-2148385829.jpg?t=st=1769239954~exp=1769243554~hmac=68fbc641cf00fbbcf32254beca8c11d337be322b3fce1a60c4631e6927e726dd&w=1480",
        category: "שתייה",
        isActive: true,
      },
      {
        name: "סט קשיות נירוסטה רב פעמיות",
        shortDescription: "כולל מברשת ניקוי",
        description:
          "סט קשיות מנירוסטה לשימוש חוזר, כולל מברשת ניקוי. פתרון אקולוגי ונוח.",
        price: 19.9,
        image:
          "https://img.freepik.com/free-photo/stainless-metallic-straws-paper-bag_23-2148768666.jpg?t=st=1769239842~exp=1769243442~hmac=c06d46ad2da9dcdb2afa7ced6282b88aff84ce8d84926fea5199cbc6542cc31a&w=1480",
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
