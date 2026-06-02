from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import uuid

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["foodstall"]

orders = db["orders"]

# ======================
# ORDER SAVE
# ======================
@app.route("/save-order", methods=["POST"])
def save_order():
    try:
        data = request.json
        order_id = str(uuid.uuid4())[:8]

        orders.insert_one({
            "order_id": order_id,
            "customer_name": data["name"],
            "mobile": data["mobile"],
            "address": data["address"],
            "payment": data["payment"],
            "items": data["items"],
            "total": data["total"]
        })

        return jsonify({
            "success": True,
            "order_id": order_id,
            "message": "Order Saved Successfully"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Database Save Error: {str(e)}"
        }), 500


# ======================
# CANCEL ORDER
# ======================
@app.route("/cancel-order/<order_id>", methods=["DELETE"])
def cancel_order(order_id):

    result = orders.delete_one({"order_id": order_id})

    if result.deleted_count > 0:
        return jsonify({
            "success": True,
            "message": "Order Cancelled Successfully"
        })

    return jsonify({
        "success": False,
        "message": "Order Not Found"
    }), 404






# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    app.run(debug=True)