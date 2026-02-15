import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import "./ProductDetailsSeo.css";
import FooterMenu from "@/components/FooterMenu/FooterMenu";

const API_URL = "https://api.kimiatoranj.com/";

export async function generateMetadata({ params }) {
  const { slugAndId } = await params; // ✅ await here
  const id = slugAndId.substring(slugAndId.lastIndexOf("-") + 1);

  const res = await fetch(`${API_URL}api/store/products/${id}/`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { title: "محصول", description: "" };
  const product = await res.json();

  return {
    title: product.seo?.meta_title || product.name,
    description: product.seo?.meta_description || "",
  };
}

export default async function ProductPage({ params }) {
  const { slugAndId } = await params; // ✅ await here
  const id = slugAndId.substring(slugAndId.lastIndexOf("-") + 1);

  const res = await fetch(`${API_URL}api/store/products/${id}/`, {
    next: { revalidate: 60 },
  });
  const product = await res.json();

  return (
    <>
      <Header />
      <ProductDetailsClient initialProduct={product} />
      {product.seo?.content_html && (
        <section
          className="seoContent"
          dangerouslySetInnerHTML={{ __html: product.seo.content_html }}
        />
      )}
      <FooterMenu />
      <Footer />
    </>
  );
}
