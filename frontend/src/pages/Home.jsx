import Layout from "../components/Layout";
import Posts from "../components/Posts";
import SuggestUsers from "../components/SuggestUsers";

const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col-reverse     ">
        <Posts />
        <SuggestUsers />
      </div>
    </Layout>
  );
};

export default Home;
