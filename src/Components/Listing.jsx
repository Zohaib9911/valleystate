import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import "swiper/css/bundle";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from './Spinner'

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null)
  console.log(listing)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  if (loading) {
    return <Spinner />
  }

  return (
    <main>
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
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  )
}
