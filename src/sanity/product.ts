const productSchema = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "id",
      title: "ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(100),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name", // Use 'name' field as the source for the slug
        maxLength: 96,  // Set max length for the slug
        slugify: (input) => {
          // Custom slugify function to handle spaces, special characters, etc.
          return input
            .toLowerCase()
            .replace(/\s+/g, "-")          // Replace spaces with hyphens
            .replace(/[^\w-]+/g, "")       // Remove special characters
            .slice(0, 96);                 // Limit the length to 96 characters
        },
      },
      validation: (Rule) => Rule.required(), // Ensure the slug is always generated
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.optional(),
    },
    {
      name: "price",
      title: "Price",
      type: "string",
      validation: (Rule) => Rule.required().min(0),
    },
    {
         name: "price_id",
          title: "stripe Price ID",
          type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true, // Enable hotspot for image cropping
      },
    },
  ],
};

export default productSchema;
