"use client";

import React from "react";
import StoryCarousel from "./story-carousel";
import { CheckCircle } from "lucide-react";

export default function StorySection({ slides = [], certifications = [] }) {
  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <StoryCarousel slides={slides} />
      <div>
        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
          Câu chuyện của chúng tôi
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Hành trình 10 năm kiến tạo
        </h2>
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          Kitchen Store ra đời từ niềm đam mê mang đến cho mọi gia đình Việt những thiết bị nhà bếp chất lượng cao,
          hiện đại và an toàn. Chúng tôi tin rằng một căn bếp tốt là nơi khởi nguồn của những bữa ăn ngon và
          khoảnh khắc ấm áp bên gia đình.
        </p>
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          Từ một cửa hàng nhỏ với 5 nhân viên, sau hơn 10 năm phát triển, chúng tôi tự hào là đối tác tin cậy
          của hơn 10,000 gia đình và hàng trăm nhà hàng trên toàn quốc. Mỗi sản phẩm chúng tôi cung cấp đều
          được lựa chọn kỹ lưỡng, đảm bảo chất lượng và giá trị cho khách hàng.
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {certifications.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
