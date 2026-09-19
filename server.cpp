#include "crow_all.h"
#include <vector>
#include <string>
#include <mutex>

using namespace std;

struct LandRecord {
    int id;
    string name;
    string place;
    double area;
    string location;
    string type;
    double paid;
    double tax;
    double due;
};

vector<LandRecord> records;
int deleted_count = 0;
mutex mtx;

double calculateTax(double area, string &type, string location) {
    double rate;
    if (area <= 10) { type = "Residential (Bastu)"; rate = 1.0; }
    else if (area <= 50) { type = "Agricultural Land"; rate = 0.5; }
    else if (area <= 100) { type = "Commercial Land"; rate = 2.0; }
    else { type = "Industrial / Large Land"; rate = 3.5; }
    
    if (location == "Urban" || location == "urban") rate += 1.0;
    else if (location == "Rural" || location == "rural") rate -= 0.2;
    
    return area * rate;
}

void addCorsHeaders(crow::response& res) {
    res.add_header("Access-Control-Allow-Origin", "*");
    res.add_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.add_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    crow::SimpleApp app;

    CROW_CATCHALL_ROUTE(app)
    ([](const crow::request& req, crow::response& res) {
        addCorsHeaders(res);
        if (req.method == crow::HTTPMethod::OPTIONS) {
            res.code = 204;
            res.end();
            return;
        }
        res.code = 404;
        res.end();
    });

    CROW_ROUTE(app, "/api/stats").methods("GET"_method, "OPTIONS"_method)
    ([](const crow::request& req){
        lock_guard<mutex> lock(mtx);
        double total_paid = 0, total_due = 0;
        for(const auto& r : records) {
            total_paid += r.paid;
            total_due += r.due;
        }
        crow::json::wvalue x;
        x["total_records"] = records.size();
        x["total_paid"] = total_paid;
        x["total_due"] = total_due;
        x["deleted_records"] = deleted_count;
        
        crow::response res(x);
        addCorsHeaders(res);
        return res;
    });

    CROW_ROUTE(app, "/api/records").methods("GET"_method, "POST"_method, "OPTIONS"_method)
    ([](const crow::request& req){
        lock_guard<mutex> lock(mtx);
        
        if (req.method == crow::HTTPMethod::GET) {
            crow::json::wvalue::list record_list;
            for(const auto& r : records) {
                crow::json::wvalue row;
                row["id"] = r.id;
                row["name"] = r.name;
                row["place"] = r.place;
                row["land_type"] = r.type;
                row["area"] = r.area;
                row["paid"] = r.paid;
                row["due"] = r.due;
                record_list.push_back(move(row));
            }
            crow::response res(crow::json::wvalue(record_list));
            addCorsHeaders(res);
            return res;
        }
        
        if (req.method == crow::HTTPMethod::POST) {
            auto x = crow::json::load(req.body);
            if (!x) return crow::response(400);

            LandRecord r;
            r.id = x["id"].i();
            r.name = x["name"].s();
            r.place = x["place"].s();
            r.area = x["area"].d();
            r.location = x["location"].s();
            r.paid = 0;
            r.tax = calculateTax(r.area, r.type, r.location);
            r.due = r.tax - r.paid;
            
            records.push_back(r);

            crow::json::wvalue res_data;
            res_data["message"] = "Record added successfully";
            crow::response res(res_data);
            addCorsHeaders(res);
            return res;
        }
        return crow::response(400);
    });

    CROW_ROUTE(app, "/api/records/<int>").methods("DELETE"_method, "OPTIONS"_method)
    ([](const crow::request& req, int id){
        lock_guard<mutex> lock(mtx);
        for (auto it = records.begin(); it != records.end(); ++it) {
            if (it->id == id) {
                records.erase(it);
                deleted_count++;
                crow::json::wvalue res_data;
                res_data["message"] = "Deleted";
                crow::response res(res_data);
                addCorsHeaders(res);
                return res;
            }
        }
        crow::response res(404);
        addCorsHeaders(res);
        return res;
    });

    CROW_ROUTE(app, "/api/search/<int>").methods("GET"_method, "OPTIONS"_method)
    ([](const crow::request& req, int id){
        lock_guard<mutex> lock(mtx);
        for(const auto& r : records) {
            if (r.id == id) {
                crow::json::wvalue row;
                row["id"] = r.id;
                row["name"] = r.name;
                row["place"] = r.place;
                row["land_type"] = r.type;
                row["area"] = r.area;
                row["paid"] = r.paid;
                row["due"] = r.due;
                crow::response res(row);
                addCorsHeaders(res);
                return res;
            }
        }
        crow::response res(404);
        addCorsHeaders(res);
        return res;
    });

    app.port(18080).multithreaded().run();
}
