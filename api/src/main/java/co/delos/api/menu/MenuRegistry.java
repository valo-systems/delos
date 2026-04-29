package co.delos.api.menu;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;

@Component
public class MenuRegistry {

    public record MenuItem(String id, String name, long priceCents) {}

    private static final Map<String, MenuItem> MENU = Map.ofEntries(
        Map.entry("starter-1",    new MenuItem("starter-1",    "Delos Sharing Board",        16500L)),
        Map.entry("starter-2",    new MenuItem("starter-2",    "Grilled Chicken Livers",      9500L)),
        Map.entry("starter-3",    new MenuItem("starter-3",    "Prawn Skewers",              14500L)),
        Map.entry("traditional-1",new MenuItem("traditional-1","Oxtail",                     29500L)),
        Map.entry("traditional-2",new MenuItem("traditional-2","Lamb Curry",                 26500L)),
        Map.entry("traditional-3",new MenuItem("traditional-3","Umgxabhiso",                 22000L)),
        Map.entry("traditional-4",new MenuItem("traditional-4","Usu Nethumbu",               19500L)),
        Map.entry("traditional-5",new MenuItem("traditional-5","Braised Short Rib",          28500L)),
        Map.entry("shisa-1",      new MenuItem("shisa-1",      "Shisanyama for Two",         49000L)),
        Map.entry("shisa-2",      new MenuItem("shisa-2",      "Shisanyama for Four",        89000L)),
        Map.entry("shisa-3",      new MenuItem("shisa-3",      "Shisanyama for Six",        125000L)),
        Map.entry("shisa-4",      new MenuItem("shisa-4",      "Boerewors Roll",              9500L)),
        Map.entry("shisa-5",      new MenuItem("shisa-5",      "Lamb Chops",                 26500L)),
        Map.entry("main-1",       new MenuItem("main-1",       "Chicken & Prawn Curry",      27500L)),
        Map.entry("main-2",       new MenuItem("main-2",       "Grilled Half Chicken",       19500L)),
        Map.entry("main-3",       new MenuItem("main-3",       "Ribeye Steak",               34500L)),
        Map.entry("main-4",       new MenuItem("main-4",       "Peri-Peri Prawns",           29500L)),
        Map.entry("seafood-1",    new MenuItem("seafood-1",    "Delos Seafood Pasta",        26500L)),
        Map.entry("seafood-2",    new MenuItem("seafood-2",    "Grilled Linefish",           24500L)),
        Map.entry("seafood-3",    new MenuItem("seafood-3",    "Calamari",                   19500L)),
        Map.entry("breakfast-1",  new MenuItem("breakfast-1",  "Delos Full Breakfast",       16500L)),
        Map.entry("breakfast-2",  new MenuItem("breakfast-2",  "Avocado & Egg Toast",        12500L)),
        Map.entry("breakfast-3",  new MenuItem("breakfast-3",  "Shakshuka",                  13500L)),
        Map.entry("platter-1",    new MenuItem("platter-1",    "Delos Meat Platter",        145000L)),
        Map.entry("platter-2",    new MenuItem("platter-2",    "Seafood Platter",           125000L)),
        Map.entry("platter-3",    new MenuItem("platter-3",    "Shisanyama & Seafood Combo",165000L)),
        Map.entry("cocktail-1",   new MenuItem("cocktail-1",   "Delos Gold",                 12500L)),
        Map.entry("cocktail-2",   new MenuItem("cocktail-2",   "African Sunset",             12000L)),
        Map.entry("cocktail-3",   new MenuItem("cocktail-3",   "Morningside Mule",           11500L)),
        Map.entry("cocktail-4",   new MenuItem("cocktail-4",   "Dark & Smoky",               13000L)),
        Map.entry("cocktail-5",   new MenuItem("cocktail-5",   "Spiced Margarita",           12500L)),
        Map.entry("mocktail-1",   new MenuItem("mocktail-1",   "Delos Sunrise",               7500L)),
        Map.entry("mocktail-2",   new MenuItem("mocktail-2",   "Mint & Mango Cooler",         7000L)),
        Map.entry("drinks-1",     new MenuItem("drinks-1",     "Craft Beer Selection",        6500L)),
        Map.entry("drinks-2",     new MenuItem("drinks-2",     "House Wine (Glass)",          8500L)),
        Map.entry("drinks-3",     new MenuItem("drinks-3",     "Soft Drinks",                 3500L))
    );

    public Optional<MenuItem> findById(String id) {
        return Optional.ofNullable(MENU.get(id));
    }

    public Collection<MenuItem> all() {
        return MENU.values();
    }
}
