import React from 'react'
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import LatestRecipes from './components/LatestRecipes';
import TrendingRecipes from './components/TrendingRecipes';

const page = () => {
  return (
    <>
      <Header />
      <CategoryList />
      <LatestRecipes />
      <TrendingRecipes />
    </>
  )
}

export default page;