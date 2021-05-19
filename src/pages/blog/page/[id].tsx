/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { NextPage, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { SiteHeader } from 'components/site-header';
import { Footer } from 'components/footer';
import { ContextParams, PER_PAGE, siteName } from 'index';
import { getBlogList } from 'domains/microCMS/services/get-blog-list';
import { BlogList } from 'components/blog/blog-list';
import { range } from 'utils';
import { PaginationArrow } from 'components/pagination/pagination-arrow';
import { BlogResponse } from 'domains/microCMS/models/blog';

type P = {
  blogs: BlogResponse[];
  totalCount: number;
  currentPageNumber: number;
};

const BlogPageId: NextPage<P> = ({ blogs, totalCount, currentPageNumber }) => {
  return (
    <div className="wrapper">
      <Head>
        <title>{siteName}</title>
      </Head>
      <SiteHeader />
      <div className="main-wrapper">
        <BlogList blogs={blogs} />
        <PaginationArrow
          maxPageNumber={Math.ceil(totalCount / PER_PAGE)}
          currentPageNumber={currentPageNumber}
        />
      </div>
      <Footer />
    </div>
  );
};

export const getStaticPaths = async (): Promise<{
  paths: string[];
  fallback: boolean;
}> => {
  const data = await getBlogList();
  const { totalCount } = data;
  const paths = range(1, Math.ceil(totalCount / PER_PAGE)).map(
    (i) => `/blog/page/${i}`,
  );

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext,
) => {
  const { id } = context.params as ContextParams;
  const numId = Number(id);
  const data = await getBlogList((numId - 1) * PER_PAGE);

  return {
    props: {
      blogs: data.contents,
      totalCount: data.totalCount,
      currentPageNumber: numId,
    },
  };
};

export default BlogPageId;