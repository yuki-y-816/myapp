class AddColumnToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :unique_name, :string
    add_column :users, :self_introduction, :text
  end
end
