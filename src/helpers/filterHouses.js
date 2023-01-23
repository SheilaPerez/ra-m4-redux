const filterByCity = (house, city) => {
    if (city === null) return true;
    return city === house.city;
}

const filterByType = (house, type) => {
    if (type === null) return true;
    return type === house.type;
}

export default function filterHouses(house, selectedCity, selectedType) {
    return [
        filterByCity(house, selectedCity),
        filterByType(house, selectedType)
    ].every(Boolean)
}