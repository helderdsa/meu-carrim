import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...');
  await prisma.priceHistory.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.shoppingList.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.market.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criar usuários
  console.log('👥 Criando usuários...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@meucarrim.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@email.com',
        password: await bcrypt.hash('123456', 10),
        role: UserRole.USER,
        avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=10b981&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Oliveira',
        email: 'maria@email.com',
        password: await bcrypt.hash('123456', 10),
        role: UserRole.USER,
        avatar: 'https://ui-avatars.com/api/?name=Maria+Oliveira&background=f59e0b&color=fff',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Santos',
        email: 'carlos@email.com',
        password: await bcrypt.hash('123456', 10),
        role: UserRole.USER,
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Santos&background=ef4444&color=fff',
      },
    }),
  ]);

  console.log(`✅ Criados ${users.length} usuários`);

  // 2. Criar categorias
  console.log('🏷️ Criando categorias...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Frutas e Verduras',
        description: 'Frutas frescas, verduras e legumes',
        color: '#22c55e',
        icon: '🍎',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Carnes e Peixes',
        description: 'Carnes vermelhas, aves, peixes e frutos do mar',
        color: '#ef4444',
        icon: '🥩',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Laticínios',
        description: 'Leite, queijos, iogurtes e derivados',
        color: '#f59e0b',
        icon: '🧀',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Padaria',
        description: 'Pães, bolos, biscoitos e produtos de panificação',
        color: '#8b5cf6',
        icon: '🍞',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bebidas',
        description: 'Águas, refrigerantes, sucos e bebidas em geral',
        color: '#06b6d4',
        icon: '🥤',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Limpeza',
        description: 'Produtos de limpeza e higiene doméstica',
        color: '#3b82f6',
        icon: '🧽',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Higiene Pessoal',
        description: 'Produtos de cuidado pessoal e beleza',
        color: '#ec4899',
        icon: '🧴',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mercearia',
        description: 'Grãos, massas, temperos e produtos secos',
        color: '#f97316',
        icon: '🏪',
      },
    }),
  ]);

  console.log(`✅ Criadas ${categories.length} categorias`);

  // 3. Criar mercados
  console.log('🏪 Criando mercados...');
  const markets = await Promise.all([
    prisma.market.create({
      data: {
        name: 'Supermercado Pão de Açúcar',
        address: 'Av. Paulista, 1234',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        latitude: -23.5613,
        longitude: -46.6565,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Extra Hipermercado',
        address: 'Rua Augusta, 567',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-000',
        latitude: -23.5505,
        longitude: -46.6333,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Carrefour Barra',
        address: 'Av. das Américas, 4666',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '22640-102',
        latitude: -23.0037,
        longitude: -43.3656,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Walmart Supercenter',
        address: 'Rua do Comércio, 890',
        city: 'Brasília',
        state: 'DF',
        zipCode: '70040-010',
        latitude: -15.7942,
        longitude: -47.8822,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Mercado Zona Sul',
        address: 'Rua Voluntários da Pátria, 445',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '22270-000',
        latitude: -22.9595,
        longitude: -43.1882,
      },
    }),
    prisma.market.create({
      data: {
        name: 'BIG Bompreço',
        address: 'Av. Caxangá, 2200',
        city: 'Recife',
        state: 'PE',
        zipCode: '52070-010',
        latitude: -8.0476,
        longitude: -34.8770,
      },
    }),
  ]);

  console.log(`✅ Criados ${markets.length} mercados`);

  // 4. Criar produtos
  console.log('🛒 Criando produtos...');
  const products = await Promise.all([
    // Frutas e Verduras
    prisma.product.create({
      data: {
        name: 'Banana Prata',
        description: 'Banana prata doce e madura, rica em potássio',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Maçã Gala',
        description: 'Maçã gala vermelha, crocante e suculenta',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tomate',
        description: 'Tomate maduro para saladas e cozinha',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Alface Americana',
        description: 'Alface americana fresca e crocante',
        image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400',
        categoryId: categories[0].id,
      },
    }),

    // Carnes e Peixes
    prisma.product.create({
      data: {
        name: 'Peito de Frango',
        description: 'Peito de frango sem osso, ideal para grelhados',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Carne Moída',
        description: 'Carne moída fresca de primeira qualidade',
        image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?w=400',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Salmão',
        description: 'Filé de salmão fresco, rico em ômega-3',
        image: 'https://images.unsplash.com/photo-1574781330855-d0db570d17d1?w=400',
        categoryId: categories[1].id,
      },
    }),

    // Laticínios
    prisma.product.create({
      data: {
        name: 'Leite Integral',
        description: 'Leite integral longa vida 1 litro',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Queijo Mussarela',
        description: 'Queijo mussarela fatiado 200g',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Iogurte Natural',
        description: 'Iogurte natural sem açúcar 170g',
        image: 'https://images.unsplash.com/photo-1571212515416-fac8043cc821?w=400',
        categoryId: categories[2].id,
      },
    }),

    // Padaria
    prisma.product.create({
      data: {
        name: 'Pão Francês',
        description: 'Pão francês tradicional fresquinho',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pão Integral',
        description: 'Pão integral de forma fatiado',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400',
        categoryId: categories[3].id,
      },
    }),

    // Bebidas
    prisma.product.create({
      data: {
        name: 'Água Mineral',
        description: 'Água mineral natural sem gás 1,5L',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        categoryId: categories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Refrigerante Cola',
        description: 'Refrigerante cola 2 litros',
        image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
        categoryId: categories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Suco de Laranja',
        description: 'Suco de laranja natural 1 litro',
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        categoryId: categories[4].id,
      },
    }),

    // Limpeza
    prisma.product.create({
      data: {
        name: 'Detergente',
        description: 'Detergente líquido neutro 500ml',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
        categoryId: categories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Papel Higiênico',
        description: 'Papel higiênico folha dupla 4 rolos',
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
        categoryId: categories[5].id,
      },
    }),

    // Higiene Pessoal
    prisma.product.create({
      data: {
        name: 'Shampoo',
        description: 'Shampoo para cabelos normais 400ml',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        categoryId: categories[6].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pasta de Dente',
        description: 'Creme dental com flúor 90g',
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
        categoryId: categories[6].id,
      },
    }),

    // Mercearia
    prisma.product.create({
      data: {
        name: 'Arroz Branco',
        description: 'Arroz branco tipo 1 pacote 5kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        categoryId: categories[7].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Feijão Preto',
        description: 'Feijão preto tipo 1 pacote 1kg',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
        categoryId: categories[7].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Macarrão Espaguete',
        description: 'Macarrão espaguete nº 8 pacote 500g',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
        categoryId: categories[7].id,
      },
    }),
  ]);

  console.log(`✅ Criados ${products.length} produtos`);

  // 5. Criar histórico de preços
  console.log('💰 Criando histórico de preços...');
  const priceHistoryData: {
    productId: string;
    marketId: string;
    price: number;
    purchaseDate: Date;
  }[] = [];

  // Para cada produto, criar preços em diferentes mercados
  for (const product of products) {
    for (const market of markets) {
      // Preço base aleatório entre R$ 1,00 e R$ 50,00
      const basePrice = (Math.random() * 49 + 1).toFixed(2);
      
      // Criar algumas entradas de preço em datas diferentes
      priceHistoryData.push({
        productId: product.id,
        marketId: market.id,
        price: parseFloat(basePrice),
        purchaseDate: new Date(2025, 6, Math.floor(Math.random() * 30) + 1), // Julho 2025
      });

      // Variação de preço para o mês seguinte
      const variationPrice = (parseFloat(basePrice) + (Math.random() - 0.5) * 5).toFixed(2);
      priceHistoryData.push({
        productId: product.id,
        marketId: market.id,
        price: Math.max(0.5, parseFloat(variationPrice)),
        purchaseDate: new Date(2025, 7, Math.floor(Math.random() * 13) + 1), // Agosto 2025
      });
    }
  }

  await prisma.priceHistory.createMany({
    data: priceHistoryData,
  });

  console.log(`✅ Criadas ${priceHistoryData.length} entradas de histórico de preços`);

  // 6. Criar listas de compras de exemplo
  console.log('📋 Criando listas de compras...');
  const shoppingLists = await Promise.all([
    prisma.shoppingList.create({
      data: {
        name: 'Compras da Semana',
        description: 'Lista de compras para a semana',
        userId: users[1].id, // João
        items: {
          create: [
            {
              productId: products[0].id, // Banana
              quantity: 6,
              estimatedPrice: 3.50,
            },
            {
              productId: products[7].id, // Leite
              quantity: 2,
              estimatedPrice: 8.00,
            },
            {
              productId: products[10].id, // Pão Francês
              quantity: 10,
              estimatedPrice: 5.00,
            },
            {
              productId: products[18].id, // Arroz
              quantity: 1,
              estimatedPrice: 18.90,
            },
          ],
        },
      },
    }),
    prisma.shoppingList.create({
      data: {
        name: 'Churrasco do Final de Semana',
        description: 'Compras para o churrasco',
        userId: users[2].id, // Maria
        items: {
          create: [
            {
              productId: products[4].id, // Peito de Frango
              quantity: 2,
              estimatedPrice: 24.00,
              isPurchased: true,
            },
            {
              productId: products[5].id, // Carne Moída
              quantity: 1,
              estimatedPrice: 15.90,
            },
            {
              productId: products[13].id, // Refrigerante
              quantity: 2,
              estimatedPrice: 12.00,
            },
          ],
        },
      },
    }),
    prisma.shoppingList.create({
      data: {
        name: 'Produtos de Limpeza',
        description: 'Reposição de produtos de limpeza',
        userId: users[3].id, // Carlos
        isCompleted: true,
        items: {
          create: [
            {
              productId: products[15].id, // Detergente
              quantity: 3,
              estimatedPrice: 9.00,
              isPurchased: true,
            },
            {
              productId: products[16].id, // Papel Higiênico
              quantity: 2,
              estimatedPrice: 16.00,
              isPurchased: true,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Criadas ${shoppingLists.length} listas de compras`);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📊 Resumo dos dados criados:');
  console.log(`   👥 ${users.length} usuários`);
  console.log(`   🏷️ ${categories.length} categorias`);
  console.log(`   🏪 ${markets.length} mercados`);
  console.log(`   🛒 ${products.length} produtos`);
  console.log(`   💰 ${priceHistoryData.length} registros de preços`);
  console.log(`   📋 ${shoppingLists.length} listas de compras`);
  console.log('\n🔑 Credenciais de acesso:');
  console.log('   Admin: admin@meucarrim.com / admin123');
  console.log('   João: joao@email.com / 123456');
  console.log('   Maria: maria@email.com / 123456');
  console.log('   Carlos: carlos@email.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    if (typeof window === 'undefined') {
      // Node.js environment
      (globalThis as any).process?.exit(1);
    }
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
