import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
}

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        return;
      }

      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id);
    toast.success("Товар добавлен в корзину");
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Загрузка...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                Нет фото
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                {product.price.toFixed(2)} ₽
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Описание</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Наличие:</span>
                    {product.stock > 0 ? (
                      <span className="font-semibold text-green-600">
                        В наличии ({product.stock} шт.)
                      </span>
                    ) : (
                      <span className="font-semibold text-destructive">
                        Нет в наличии
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Добавить в корзину
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
