import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import Spinner from './Spinner';

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  console.log(listings)

  useEffect(() => {
    const fetchListings = async () => {
      const listRef = collection(db, "listings");
      const q = query(listRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      });
      setListings(listings);
      setLoading(false)
    }
    fetchListings()
  }, [])
  if (loading) {
    return <Spinner />
  }
  if (listings.length === 0) {
    <></>
  }
  return (
    <>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        autoplay={{
          delay: 2000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false
        }}
      >
        {listings.map(({ data, id }) => (
          <SwiperSlide
            onClick={() => navigate(`/category/${data.type}/${id}`)}
            key={id}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
            <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
              {data.name}
            </p>
            <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
              ${data.discountedPrice ?? data.regularPrice}
              {data.type === "rent" && " / month"}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
