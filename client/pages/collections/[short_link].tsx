import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import ProductCollection from "../../components/product-collection/product-collection";
import { GetCollectionDescData, GetCollectionDescVars, GetPageCollectionData, GET_COLLECTIONS_DESCRIPTION, GET_PAGE_COLLECTIONS } from "../../graphql/queries/collection";
import { GetProductByCollectionData, GetProductByCollectionVars, GET_PRODUCT_BY_COLLECTION } from "../../graphql/queries/product";
import { Collection } from "../../types/collection";
import { Product } from "../../types/product";
import { initializeApollo } from "../../utils/apollo-client";

interface ProductByCategoryProps {
    collection: Collection
    products: Product[]
}

function ProductByCategoryPage({ collection, products }: ProductByCategoryProps) {
    return (
        <>
            <Head>
                <title>Product</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <ProductCollection collection={collection} products={products}/>
            <Footer />
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const client = initializeApollo()

    const { data, error } = await client.query<GetPageCollectionData>({
        query: GET_PAGE_COLLECTIONS
    })

    if(!data || error) {
        return { paths: [], fallback: false }
    }

    const paths = data.collections.map(collection => ({
        params: {
            short_link: collection.short_link
        }
    }))

    return {
      paths,
      fallback: false, // can also be true or 'blocking'
    }
  }
  
  // `getStaticPaths` requires using `getStaticProps`
  export const getStaticProps: GetStaticProps = async (context) => {
    const short_link = context.params?.short_link
    const client = initializeApollo()

    const { data, error } = await client.query<GetProductByCollectionData, GetProductByCollectionVars>({
        query: GET_PRODUCT_BY_COLLECTION,
        variables: { collection: String(short_link) }
    })
    const { data: collectionData, error: collectionErr } = await client.query<GetCollectionDescData, GetCollectionDescVars>({
        query: GET_COLLECTIONS_DESCRIPTION,
        variables: { short_link: String(short_link) }
    })

    if(!data || !collectionData || error || collectionErr) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        }
    }

    return {
      props: { products: data.products, collection: collectionData.collection },
    }
  }

export default ProductByCategoryPage;