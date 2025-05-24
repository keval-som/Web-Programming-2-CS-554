import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Head from "next/head";
import ShowCards from "@/components/ShowCards";

export default function List(props) {
    return (
        <div>
            {props.data.map((data) => {
                return (
                    <ShowCards
                        key={data.id}
                        data={data}
                        type="payloads"
                        name={data.name}
                    />
                );
            })}
            {props.next && (
                <Link
                    href={`/payloads/page/${parseInt(props.page) + 1}`}
                    className="btn-primary"
                >
                    Next Page
                </Link>
            )}
            {props.prev && (
                <Link
                    href={`/payloads/page/${parseInt(props.page) - 1}`}
                    className="btn-primary"
                >
                    Previous Page
                </Link>
            )}
            <Link href="/" className="btn-primary">
                Go to Home
            </Link>
        </div>
    );
}

export async function getStaticProps({ params }) {
    const page = parseInt(params.page);
    const { data } = await axios.post(
        "https://api.spacexdata.com/v4/payloads/query",
        {
            query: {},
            options: {
                limit: 10,
                page: page + 1,
            },
        }
    );

    return {
        props: {
            data: data.docs,
            page: page,
            prev: data.hasPrevPage,
            next: data.hasNextPage,
        },
    };
}

export async function getStaticPaths() {
    const { data } = await axios.post(
        "https://api.spacexdata.com/v4/payloads/query",
        {
            query: {},
            options: {},
        }
    );
    const pages = data.totalPages;
    let pagesArray = Array.from({ length: pages }, (_, i) => i);
    const paths = pagesArray.map((page) => {
        return {
            params: { page: page.toString() },
        };
    });
    return {
        paths,
        fallback: false,
    };
}
