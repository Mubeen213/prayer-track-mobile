import React from "react";
import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => (
  <View className={`bg-white border border-gray-200 rounded-lg ${className}`}>
    {children}
  </View>
);

const CardContent = ({ children, className }: CardProps) => (
  <View className={className}>{children}</View>
);

export const ChapterSkeleton = () => {
  return (
    <View className="min-h-screen bg-[#fafaf7]">
      {/* Header Skeleton */}
      <View className="border-b border-gray-200 bg-white">
        <View className="max-w-5xl mx-auto py-3 px-4">
          <View className="flex flex-row items-center justify-between">
            <View className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <View className="hidden lg:flex flex-row items-center space-x-4">
              <View className="h-9 w-[140px] bg-gray-200 rounded-md animate-pulse" />
              <View className="h-9 w-[130px] bg-gray-200 rounded-md animate-pulse" />
              <View className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
            </View>
          </View>
        </View>
      </View>

      {/* Chapter Title Skeleton */}
      <View className="max-w-3xl mx-auto pt-8 px-2">
        <View className="text-center mb-8">
          <View className="h-10 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <View className="h-6 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
        </View>
      </View>

      {/* Verses Skeleton */}
      <View className="max-w-3xl mx-auto pb-8 px-1">
        <View className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-0">
                {/* Arabic Text Skeleton */}
                <View className="p-6 border-b border-gray-100">
                  <View className="flex justify-end">
                    <View className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                  </View>
                </View>
                {/* Translation Skeleton */}
                <View className="p-6 bg-gray-50/50">
                  <View className="space-y-4">
                    <View className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <View className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    </View>
  );
};
