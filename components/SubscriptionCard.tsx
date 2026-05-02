import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  expanded,
  onPress,
  paymentMethod,
  startDate,
  status,
}: SubscriptionCardProps) => {
  const categoryLabel = category?.trim()?.length ? category.trim() : undefined;
  const planLabel = plan?.trim()?.length ? plan.trim() : undefined;
  const paymentLabel = paymentMethod?.trim()?.length
    ? paymentMethod.trim()
    : undefined;
  const startDateLabel = startDate
    ? formatSubscriptionDateTime(startDate)
    : undefined;
  const renewalDateLabel = renewalDate
    ? formatSubscriptionDateTime(renewalDate)
    : undefined;
  const statusLabel = status ? formatStatusLabel(status) : undefined;

  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text className="sub-title">{name}</Text>
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
            {categoryLabel || planLabel || renewalDateLabel}
          </Text>
        </View>
        <View className="sub-price-box">
          <Text className="sub-pricing">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>
      {expanded && (
        <View className="sub-bdy">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {paymentLabel}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Category:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {categoryLabel || planLabel}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Started:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {startDateLabel}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Renewal date:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {renewalDateLabel}
                </Text>
              </View>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Status:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
