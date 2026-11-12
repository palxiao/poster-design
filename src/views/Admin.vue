<!--
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
-->
<template>
  <div class="admin-shell">
    <AdminSidebar :active="activeTab" :user="adminUser" @select="onSelectTab" @logout="onLogout" />

    <div class="admin-main">
      <AdminTopbar :title="pageMeta.title" :description="pageMeta.description" @home="jump2home" />

      <main class="admin-body">
        <!-- 总览：平台内容规模 + 常用管理入口 -->
        <section v-if="activeTab === 'overview'" class="overview-pane">
          <div v-loading="loading" class="overview-stats">
            <StatCard
              v-for="stat in overviewStats"
              :key="stat.key"
              :label="stat.label"
              :value="stat.value"
              :icon="stat.icon"
              :hint="stat.hint"
              @go="onStatGo(stat)"
            />
          </div>

          <section class="pane">
            <h3 class="pane-title">{{ t('admin.quick.title') }}</h3>
            <div class="quick-actions">
              <QuickAction :icon="Upload" :name="t('admin.quick.psdTemplate')" :desc="t('admin.quick.psdTemplateDesc')" @go="openPSDImport()" />
              <QuickAction :icon="Upload" :name="t('admin.quick.psdComponent')" :desc="t('admin.quick.psdComponentDesc')" @go="openPSDImport(1)" />
              <QuickAction :icon="EditPen" :name="t('admin.font.add')" :desc="t('admin.quick.fontDesc')" @go="openFontDialog()" />
              <QuickAction :icon="MagicStick" :name="t('admin.quick.ai')" :desc="t('admin.quick.aiDesc')" @go="onSelectTab('ai-settings')" />
            </div>
          </section>
        </section>

        <!-- 模板与组件 -->
        <section v-else-if="activeTab === 'templates'" class="pane">
          <div class="pane-toolbar">
            <el-radio-group v-model="templateType" size="small">
              <el-radio-button value="templates-list">{{ t('admin.v.template') }}</el-radio-button>
              <el-radio-button value="components-list">{{ t('admin.v.component') }}</el-radio-button>
            </el-radio-group>
            <span class="toolbar-spacer"></span>
            <el-button type="primary" size="small" plain @click="openPSDImport(templateType === 'components-list' ? 1 : undefined)">
              <el-icon><Upload /></el-icon>
              {{ templateType === 'components-list' ? t('admin.quick.psdComponent') : t('admin.quick.psdTemplate') }}
            </el-button>
            <el-button size="small" :loading="loading" @click="loadTab">
              <el-icon><Refresh /></el-icon>
              {{ t('admin.v.refresh') }}
            </el-button>
          </div>
          <AdminTemplateTable
            :rows="templateType === 'components-list' ? componentRows : templateRows"
            :loading="loading"
            @delete="onDelTemplate"
            @remove="onRemoveTemplate"
            @edit="onEditTemplate"
            @category="openCategoryEditor"
          />
        </section>

        <!-- 素材管理 -->
        <section v-else-if="activeTab === 'materials'" class="pane">
          <div class="pane-toolbar">
            <el-input
              v-model="assetQuery.search"
              size="small"
              clearable
              :placeholder="t('admin.v.searchMaterial')"
              class="search-input"
              @keyup.enter="reloadFromPage1"
              @clear="reloadFromPage1"
            />
            <el-button size="small" @click="reloadFromPage1">{{ t('admin.v.search') }}</el-button>
            <span class="toolbar-spacer"></span>
            <el-button type="primary" size="small" @click="openAssetDialog('materials')">
              <el-icon><Plus /></el-icon>
              {{ t('admin.v.addUpload') }}
            </el-button>
          </div>
          <el-table class="admin-table" :data="materialAssets" size="small" stripe v-loading="loading">
            <el-table-column prop="category" :label="t('admin.v.group')" width="150" />
            <el-table-column prop="type" :label="t('admin.v.elementType')" width="120" />
            <el-table-column prop="title" :label="t('admin.v.name')" min-width="180" show-overflow-tooltip />
            <el-table-column prop="url" :label="t('admin.v.url')" min-width="280" show-overflow-tooltip />
            <el-table-column :label="t('admin.v.actions')" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="openAssetDialog('materials', row)">{{ t('admin.v.edit') }}</el-button>
                <el-button type="danger" size="small" link @click="onDeleteAsset('materials', row)">{{ t('admin.v.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- 照片管理 -->
        <section v-else-if="activeTab === 'photos'" class="pane">
          <div class="pane-toolbar">
            <el-input
              v-model="assetQuery.search"
              size="small"
              clearable
              :placeholder="t('admin.v.searchPhoto')"
              class="search-input"
              @keyup.enter="reloadFromPage1"
              @clear="reloadFromPage1"
            />
            <el-button size="small" @click="reloadFromPage1">{{ t('admin.v.search') }}</el-button>
            <span class="toolbar-spacer"></span>
            <el-button type="primary" size="small" @click="openAssetDialog('photos')">
              <el-icon><Plus /></el-icon>
              {{ t('admin.v.addUpload') }}
            </el-button>
          </div>
          <el-table class="admin-table" :data="photoAssets" size="small" stripe v-loading="loading">
            <el-table-column prop="categoryName" :label="t('admin.v.category')" width="150" />
            <el-table-column prop="title" :label="t('admin.v.name')" min-width="180" show-overflow-tooltip />
            <el-table-column prop="url" :label="t('admin.v.url')" min-width="280" show-overflow-tooltip />
            <el-table-column :label="t('admin.v.actions')" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="openAssetDialog('photos', row)">{{ t('admin.v.edit') }}</el-button>
                <el-button type="danger" size="small" link @click="onDeleteAsset('photos', row)">{{ t('admin.v.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- 分类管理 -->
        <section v-else-if="activeTab === 'categories'" class="pane">
          <div class="pane-toolbar">
            <el-radio-group v-model="categoryTab" size="small" @change="reloadFromPage1">
              <el-radio-button value="template-categories">{{ t('admin.v.templateCategories') }}</el-radio-button>
              <el-radio-button value="materials">{{ t('admin.v.materialCategories') }}</el-radio-button>
              <el-radio-button value="photos">{{ t('admin.v.photoCategories') }}</el-radio-button>
            </el-radio-group>
          </div>

          <template v-if="categoryTab === 'template-categories'">
            <div class="pane-toolbar">
              <el-radio-group v-model="templateCategoryType" size="small" @change="reloadFromPage1">
                <el-radio-button :value="0">{{ t('admin.v.template') }}</el-radio-button>
                <el-radio-button :value="1">{{ t('admin.v.component') }}</el-radio-button>
              </el-radio-group>
              <span class="toolbar-spacer"></span>
              <el-input
                v-model="newTemplateCategory.name"
                size="small"
                :placeholder="t('admin.v.categoryNamePlaceholder')"
                class="name-input"
                @keyup.enter="addTemplateCategory"
              />
              <el-button type="primary" size="small" @click="addTemplateCategory">{{ t('admin.v.addCategory') }}</el-button>
            </div>
            <el-table class="admin-table" :data="templateCategories" size="small" stripe v-loading="loading">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="name" :label="t('admin.v.categoryName')" min-width="220" show-overflow-tooltip />
              <el-table-column prop="sort" :label="t('admin.v.sort')" width="90" />
              <el-table-column :label="t('admin.v.actions')" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" size="small" link @click="onRenameTemplateCategory(row)">{{ t('admin.v.rename') }}</el-button>
                  <el-button type="danger" size="small" link @click="onDelTemplateCategory(row)">{{ t('admin.v.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <template v-else>
            <div class="pane-toolbar">
              <span class="toolbar-spacer"></span>
              <el-button type="primary" size="small" @click="onAddCategory(categoryTab)">
                <el-icon><Plus /></el-icon>
                {{ t('admin.v.addCategory') }}
              </el-button>
            </div>
            <el-table
              class="admin-table"
              :data="categoryTab === 'materials' ? materialCates : photoCates"
              size="small"
              stripe
              v-loading="loading"
            >
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column v-if="categoryTab === 'photos'" prop="cate" :label="t('admin.v.categoryKey')" width="160" />
              <el-table-column prop="name" :label="t('admin.v.categoryName')" min-width="220" show-overflow-tooltip />
              <el-table-column prop="count" :label="t('admin.v.count')" width="100" />
              <el-table-column :label="t('admin.v.actions')" width="160" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" size="small" link @click="onRenameCategory(categoryTab, row)">{{ t('admin.v.rename') }}</el-button>
                  <el-button type="danger" size="small" link @click="onDelCategory(categoryTab, row)">{{ t('admin.v.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </section>

        <!-- 字体管理 -->
        <section v-else-if="activeTab === 'fonts'" class="pane">
          <div class="pane-toolbar">
            <el-input
              v-model="fontQuery.search"
              size="small"
              clearable
              :placeholder="t('admin.v.searchFont')"
              class="search-input"
              @keyup.enter="reloadFromPage1"
              @clear="reloadFromPage1"
            />
            <el-button size="small" @click="reloadFromPage1">{{ t('admin.v.search') }}</el-button>
            <span class="toolbar-spacer"></span>
            <el-button type="primary" size="small" @click="openFontDialog()">
              <el-icon><Plus /></el-icon>
              {{ t('admin.font.add') }}
            </el-button>
          </div>
          <el-table class="admin-table" :data="fonts" size="small" stripe v-loading="loading">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="alias" :label="t('admin.v.name')" min-width="120" show-overflow-tooltip />
            <el-table-column prop="value" label="value" min-width="140" show-overflow-tooltip />
            <el-table-column :label="t('admin.v.language')" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="row.lang === 'en' ? 'warning' : 'success'">{{ row.lang === 'en' ? t('admin.v.english') : t('admin.v.chinese') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="woff" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">
                <a v-if="row.woff" :href="row.woff" target="_blank" rel="noopener" class="link-primary">{{ row.woff }}</a>
                <span v-else class="muted-text">-</span>
              </template>
            </el-table-column>
            <el-table-column prop="font_family" label="font-family" min-width="140" show-overflow-tooltip />
            <el-table-column prop="created_at" :label="t('admin.v.createdAt')" width="170" />
            <el-table-column :label="t('admin.v.actions')" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="openFontDialog(row)">{{ t('admin.v.edit') }}</el-button>
                <el-button type="danger" size="small" link @click="onDelFont(row)">{{ t('admin.v.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="fontQuery.total > fontQuery.pageSize"
            class="admin-pagination"
            background
            layout="total, sizes, prev, pager, next"
            :total="fontQuery.total"
            :current-page="fontQuery.page"
            :page-size="fontQuery.pageSize"
            :page-sizes="[10, 20, 50]"
            @current-change="(page: number) => { fontQuery.page = page; loadTab() }"
            @size-change="(size: number) => { fontQuery.pageSize = size; fontQuery.page = 1; loadTab() }"
          />
        </section>

        <!-- 用户图片 -->
        <section v-else-if="activeTab === 'user-images'" class="pane">
          <el-table class="admin-table" :data="userImages" size="small" stripe v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column :label="t('admin.v.preview')" width="100">
              <template #default="{ row }">
                <el-image :src="row.url" :preview-src-list="[row.url]" fit="cover" style="width: 64px; height: 36px" preview-teleported />
              </template>
            </el-table-column>
            <el-table-column :label="t('admin.v.size')" width="110"><template #default="{ row }">{{ row.width }} × {{ row.height }}</template></el-table-column>
            <el-table-column prop="created_at" :label="t('admin.v.uploadedAt')" width="180" />
            <el-table-column :label="t('admin.v.actions')" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="danger" size="small" link @click="onDelUserImage(row)">{{ t('admin.v.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- 用户管理 -->
        <section v-else-if="activeTab === 'users'" class="pane">
          <div class="pane-toolbar">
            <span class="toolbar-spacer"></span>
            <el-button size="small" :loading="loading" @click="loadTab">
              <el-icon><Refresh /></el-icon>
              {{ t('admin.v.refresh') }}
            </el-button>
          </div>
          <el-table class="admin-table" :data="users" size="small" stripe v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="account" :label="t('admin.v.account')" min-width="200" show-overflow-tooltip />
            <el-table-column :label="t('admin.v.role')" width="120">
              <template #default="{ row }">
                <el-tag :type="row.role === 1 ? 'danger' : 'info'" size="small">{{ row.role === 1 ? t('admin.v.admin') : t('admin.v.user') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" :label="t('admin.v.registeredAt')" width="180" />
            <el-table-column :label="t('admin.v.actions')" width="110" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.role !== 1" type="danger" size="small" link @click="onDelUser(row)">{{ t('admin.v.delete') }}</el-button>
                <span v-else class="muted-text">{{ t('admin.v.protected') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- 用户作品 -->
        <section v-else-if="activeTab === 'designs'" class="pane">
          <div class="pane-toolbar">
            <span class="toolbar-spacer"></span>
            <el-button size="small" :loading="loading" @click="loadTab">
              <el-icon><Refresh /></el-icon>
              {{ t('admin.v.refresh') }}
            </el-button>
          </div>
          <el-table class="admin-table" :data="designs" size="small" stripe v-loading="loading">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="account" :label="t('admin.v.userLabel')" width="150" />
            <el-table-column :label="t('admin.v.cover')" width="100">
              <template #default="{ row }">
                <el-image v-if="row.cover" :src="row.cover" :preview-src-list="[row.cover]" fit="cover" style="width: 64px; height: 36px" preview-teleported />
                <span v-else class="muted-text">{{ t('admin.v.none') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" :label="t('admin.v.title')" min-width="180" show-overflow-tooltip />
            <el-table-column :label="t('admin.v.size')" width="110"><template #default="{ row }">{{ row.width }} × {{ row.height }}</template></el-table-column>
            <el-table-column prop="created_at" :label="t('admin.v.createdAt')" width="180" />
            <el-table-column :label="t('admin.v.actions')" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="danger" size="small" link @click="onDelDesign(row)">{{ t('admin.v.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- AI 设置 -->
        <section v-else-if="activeTab === 'ai-settings'" class="pane">
          <div class="pane-toolbar">
            <span class="toolbar-note">
              {{ t('admin.ai.intro1') }}
              {{ t('admin.ai.intro2') }}<a class="link-primary" href="https://bigmodel.cn/apikey/platform" target="_blank" rel="noopener">{{ t('admin.ai.apply') }}</a>{{ t('admin.ai.intro3') }}
            </span>
            <span class="toolbar-spacer"></span>
            <el-button size="small" :loading="aiTesting" @click="testAiConnection">
              <el-icon><Link /></el-icon>
              {{ t('admin.ai.test') }}
            </el-button>
          </div>
          <el-form class="ai-form" label-width="110px" size="small">
            <el-form-item :label="t('admin.ai.baseUrl')">
              <el-input v-model="aiForm.base_url" :placeholder="t('admin.ai.baseUrlPlaceholder')" />
            </el-form-item>
            <el-form-item label="API Key">
              <el-input v-model="aiForm.api_key" :placeholder="aiForm.has_key ? t('admin.ai.keyConfigured') : t('admin.ai.keyPlaceholder')" show-password />
            </el-form-item>
            <el-form-item :label="t('admin.ai.textModel')">
              <el-input v-model="aiForm.text_model" :placeholder="t('admin.ai.textModelPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('admin.ai.imageModel')">
              <el-input v-model="aiForm.image_model" :placeholder="t('admin.ai.imageModelPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('admin.ai.imageSize')">
              <el-select v-model="aiForm.image_size_mode" style="width: 100%">
                <el-option v-for="item in AI_SIZE_MODE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('admin.ai.enable')">
              <el-switch v-model="aiForm.enabled" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="aiSaving" @click="saveAiSettings">{{ t('admin.ai.save') }}</el-button>
            </el-form-item>
          </el-form>
        </section>

        <el-pagination
          v-if="adminTotal > adminPageSize"
          class="admin-pagination"
          background
          layout="total, sizes, prev, pager, next"
          :total="adminTotal"
          :current-page="adminPage"
          :page-size="adminPageSize"
          :page-sizes="[10, 20, 50]"
          @current-change="(page: number) => { adminPage = page; loadTab() }"
          @size-change="(size: number) => { adminPageSize = size; adminPage = 1; loadTab() }"
        />
      </main>
    </div>

    <el-dialog v-model="categoryDialog.visible" :title="t('admin.v.changeCategory')" width="420px">
      <el-form label-width="80px">
        <el-form-item :label="t('admin.v.category')">
          <el-select v-model="categoryDialog.cate" :placeholder="t('admin.v.pickCategory')" clearable style="width: 100%">
            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialog.visible = false">{{ t('admin.v.cancel') }}</el-button>
        <el-button type="primary" :loading="categoryDialog.submitting" @click="saveCategory">{{ t('admin.v.save') }}</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="assetDialog.visible" :title="assetDialog.index >= 0 ? t('admin.v.editAsset') : t('admin.v.addAsset')" width="520px">
      <el-form label-width="80px">
        <el-form-item :label="t('admin.v.group')">
          <el-select v-model="assetDialog.cate" style="width: 100%">
            <el-option v-for="item in assetDialog.categories" :key="item.cate" :label="item.name" :value="item.cate" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="assetDialog.type === 'materials'" :label="t('admin.v.elementType')">
          <el-select v-model="assetDialog.assetType" style="width: 100%">
            <el-option :label="t('admin.v.typeImage')" value="image" />
            <el-option :label="t('admin.v.typeSvg')" value="svg" />
            <el-option :label="t('admin.v.typeMask')" value="mask" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('admin.v.name')"><el-input v-model="assetDialog.title" /></el-form-item>
        <el-form-item :label="t('admin.v.imageUrl')"><el-input v-model="assetDialog.url" :placeholder="t('admin.v.remoteUrl')" /></el-form-item>
        <el-form-item :label="t('admin.v.localFile')"><input type="file" accept="image/*,.svg" @change="onAssetFileChange" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assetDialog.visible = false">{{ t('admin.v.cancel') }}</el-button>
        <el-button type="primary" :loading="assetDialog.submitting" @click="submitAsset">{{ t('admin.v.save') }}</el-button>
      </template>
    </el-dialog>

    <!-- 新增 / 编辑字体对话框 -->
    <el-dialog v-model="fontDialog.visible" :title="fontDialog.title" width="560px" @closed="resetFontForm">
      <el-form ref="fontFormRef" :model="fontDialog.form" :rules="fontRules" label-width="92px" size="small">
        <el-form-item label="字体名称" prop="alias">
          <el-input v-model="fontDialog.form.alias" placeholder="例：站酷快乐体" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="value" prop="value">
          <el-input v-model="fontDialog.form.value" placeholder="CSS 用的 family slug，例：zcool-kuaile-regular" maxlength="60" />
        </el-form-item>
        <el-form-item label="woff 链接" prop="woff">
          <el-input v-model="fontDialog.form.woff" placeholder="https://..." />
          <input type="file" accept=".woff,.woff2" style="margin-top: 6px" @change="onFontFileChange" />
          <span class="muted-text">可直接选择 woff 文件上传，或填写远程链接</span>
        </el-form-item>
        <el-form-item label="ttf 链接">
          <el-input v-model="fontDialog.form.ttf" placeholder="可选" />
        </el-form-item>
        <el-form-item label="预览图">
          <el-input v-model="fontDialog.form.preview" placeholder="可选，预览图 URL" />
        </el-form-item>
        <el-form-item :label="t('admin.v.language')" prop="lang">
          <el-radio-group v-model="fontDialog.form.lang">
            <el-radio value="zh">{{ t('admin.v.chinese') }}</el-radio>
            <el-radio value="en">{{ t('admin.v.english') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="font-family">
          <el-input v-model="fontDialog.form.font_family" placeholder="可选" maxlength="80" />
        </el-form-item>
        <el-form-item v-if="!fontDialog.form.id" label="文件大小">
          <el-input-number v-model="fontDialog.form.size" :min="0" :step="1" placeholder="字节，可选" />
        </el-form-item>
        <el-form-item v-if="!fontDialog.form.id" label="woff 大小">
          <el-input-number v-model="fontDialog.form.woff_size" :min="0" :step="1" placeholder="字节，可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="fontDialog.visible = false">{{ t('admin.v.cancel') }}</el-button>
        <el-button type="primary" :loading="fontDialog.submitting" @click="submitFont">{{ fontDialog.form.id ? '确认编辑' : '确认新增' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2026 palxiao https://xpai.design
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// ElTable / ElTabs 等未全局注册（见 elementConfig.ts），本页手动引入
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElImage,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElIcon,
  ElRadioGroup,
  ElRadio,
  ElRadioButton,
  ElPagination,
  ElSelect,
  ElOption,
  ElSwitch,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { Grid, Files, PictureFilled, Document, Upload, EditPen, MagicStick, Refresh, Plus, Link } from '@element-plus/icons-vue'
import { LocalStorageKey } from '@/config'
import * as adminApi from '@/api/admin'
import * as materialApi from '@/api/material'
import AdminTemplateTable from '@/views/components/AdminTemplateTable.vue'
import AdminSidebar from './admin/comps/AdminSidebar.vue'
import AdminTopbar from './admin/comps/AdminTopbar.vue'
import StatCard from './admin/comps/StatCard.vue'
import QuickAction from './admin/comps/QuickAction.vue'
import { PAGE_META, AI_SIZE_MODE_OPTIONS } from './admin/constants'
import type { TOverviewStat, TCategoryTab, TAdminUser } from './admin/types'

const router = useRouter()
const { t } = useI18n()
const activeTab = ref('overview')
const categoryTab = ref<TCategoryTab>('template-categories')
const loading = ref(false)
const templates = ref<any[]>([])
const templateType = ref('templates-list')
const userImages = ref<any[]>([])
const users = ref<adminApi.TAdminUserItem[]>([])
const designs = ref<adminApi.TAdminDesignItem[]>([])
const materialCates = ref<any[]>([])
const photoCates = ref<any[]>([])
const materialAssets = ref<any[]>([])
const photoAssets = ref<any[]>([])
const assetQuery = reactive({ search: '' })
const templateCategories = ref<any[]>([])
const newTemplateCategory = reactive({ name: '' })
const templateCategoryType = ref<0 | 1>(0)
const fonts = ref<adminApi.TAdminFontItem[]>([])
const fontQuery = reactive({ page: 1, pageSize: 20, search: '', total: 0 })
// AI 设置
const aiForm = reactive<adminApi.TAiSettings>({
  api_key: '',
  has_key: false,
  text_model: '',
  image_model: '',
  base_url: '',
  image_size_mode: 'zhipu',
  enabled: false,
})
const aiSaving = ref(false)
const aiTesting = ref(false)
const adminPage = ref(1)
const adminPageSize = ref(20)
const adminTotal = ref(0)
// 本地登录的管理员（侧边栏底部展示）
const adminUser = reactive<TAdminUser>({ account: '', role: 0 })
// 总览页统计：pageSize 上限 100（后端 pageResult 封顶），常规管理规模下可完整计数
const overview = reactive({ templates: 0, components: 0, userImages: 0, fonts: 0 })
const templateRows = computed(() => templates.value.filter((item) => item.type === 0))
const componentRows = computed(() => templates.value.filter((item) => item.type === 1))
const categoryOptions = ref<any[]>([])
const categoryDialog = reactive({ visible: false, submitting: false, row: null as any, cate: '' })
const assetDialog = reactive({
  visible: false,
  submitting: false,
  type: 'materials' as 'materials' | 'photos',
  cate: '',
  sourceCate: '',
  assetType: 'image',
  title: '',
  url: '',
  index: -1,
  file: null as File | null,
  categories: [] as any[],
})

const pageMeta = computed(() => PAGE_META[activeTab.value] || PAGE_META.overview)

const overviewStats = computed<TOverviewStat[]>(() => [
  { key: 'templates', tab: 'templates', label: t('admin.v.template'), value: overview.templates, icon: Grid, hint: t('admin.stat.templatesHint'), templateType: 'templates-list' },
  { key: 'components', tab: 'templates', label: t('admin.v.component'), value: overview.components, icon: Files, hint: t('admin.stat.componentsHint'), templateType: 'components-list' },
  { key: 'user-images', tab: 'user-images', label: t('admin.stat.userImages'), value: overview.userImages, icon: PictureFilled, hint: t('admin.stat.userImagesHint') },
  { key: 'fonts', tab: 'fonts', label: t('admin.stat.fonts'), value: overview.fonts, icon: Document, hint: t('admin.stat.fontsHint') },
])

/** 统计卡跳转：模板/组件共用一个面板，需同时切到对应子视图 */
function onStatGo(stat: TOverviewStat) {
  if (stat.templateType) templateType.value = stat.templateType
  onSelectTab(stat.tab)
}

/** 字体新增 / 编辑对话框状态 */
const fontDialog = reactive({
  visible: false,
  title: t('admin.font.add'),
  submitting: false,
  form: {
    id: 0,
    alias: '',
    value: '',
    woff: '',
    ttf: '',
    preview: '',
    lang: 'zh' as 'zh' | 'en',
    font_family: '',
    size: 0,
    woff_size: 0,
  },
})
const fontFormRef = ref<FormInstance | null>(null)
const fontRules: FormRules = {
  alias: [{ required: true, message: t('admin.font.nameRequired'), trigger: 'blur' }],
  value: [{ required: true, message: t('admin.font.valueRequired'), trigger: 'blur' }],
  woff: [{ required: true, message: t('admin.font.woffRequired'), trigger: 'blur' }],
  lang: [{ required: true, message: t('admin.font.langRequired'), trigger: 'change' }],
}

/** 重置新增字体表单 */
function resetFontForm() {
  fontDialog.form.id = 0
  fontDialog.form.alias = ''
  fontDialog.form.value = ''
  fontDialog.form.woff = ''
  fontDialog.form.ttf = ''
  fontDialog.form.preview = ''
  fontDialog.form.lang = 'zh'
  fontDialog.form.font_family = ''
  fontDialog.form.size = 0
  fontDialog.form.woff_size = 0
  fontFormRef.value?.clearValidate()
}

function openFontDialog(row?: adminApi.TAdminFontItem) {
  resetFontForm()
  if (row) {
    fontDialog.title = t('admin.font.edit')
    fontDialog.form.id = row.id
    fontDialog.form.alias = row.alias
    fontDialog.form.value = row.value
    fontDialog.form.woff = row.woff
    fontDialog.form.ttf = row.ttf
    fontDialog.form.preview = row.preview
    fontDialog.form.lang = row.lang === 'en' ? 'en' : 'zh'
    fontDialog.form.font_family = row.font_family
  } else {
    fontDialog.title = t('admin.font.add')
  }
  fontDialog.visible = true
}

async function openAssetDialog(type: 'materials' | 'photos', row?: any) {
  assetDialog.type = type; assetDialog.index = row?.index ?? -1; assetDialog.sourceCate = row?.category || ''; assetDialog.title = row?.title || ''; assetDialog.url = row?.url || ''; assetDialog.assetType = row?.type === 'svg' || row?.type === 'mask' ? row.type : 'image'; assetDialog.file = null
  const res: any = await adminApi.getCategories(type, { page: 1, pageSize: 100 }); assetDialog.categories = res?.list || []
  assetDialog.cate = row?.category || assetDialog.categories[0]?.cate || ''
  assetDialog.visible = true
}

function onAssetFileChange(event: Event) { assetDialog.file = (event.target as HTMLInputElement).files?.[0] || null }

async function submitAsset() {
  if (!assetDialog.cate) return ElMessage.warning(t('admin.v.pickCategory'))
  assetDialog.submitting = true
  try {
    let url = assetDialog.url.trim()
    if (assetDialog.file) {
      const res: any = await materialApi.upload({ file: assetDialog.file, folder: assetDialog.type }, () => {})
      url = res?.url || res?.data?.url || ''
    }
    if (!url) return ElMessage.warning(t('admin.msg.urlOrFile'))
    const asset = { title: assetDialog.title.trim(), url, thumb: url, ...(assetDialog.type === 'materials' ? { type: assetDialog.assetType } : {}) }
    const res: any = assetDialog.index >= 0 ? await adminApi.updateAsset(assetDialog.type, assetDialog.cate, assetDialog.index, asset, assetDialog.sourceCate) : await adminApi.addAsset(assetDialog.type, assetDialog.cate, asset)
    if (res?.code === 200) { ElMessage.success(t('admin.msg.saved')); assetDialog.visible = false; await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.saveFailed'))
  } catch (error: any) { ElMessage.error(error?.message || t('admin.msg.saveFailed')) } finally { assetDialog.submitting = false }
}

async function onDeleteAsset(type: 'materials' | 'photos', row: any) {
  try {
    await ElMessageBox.confirm(t('admin.confirm.deleteItem', { name: row.title || row.url || t('admin.msg.thisAsset') }), t('admin.msg.notice'), { type: 'warning' })
    const res: any = await adminApi.deleteAsset(type, row.category, row.index)
    if (res?.code === 200) { ElMessage.success(t('admin.msg.deleted')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.deleteFailed'))
  } catch (error) {
    // 忽略取消操作。
  }
}

async function onFontFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  fontDialog.submitting = true
  try {
    const res: any = await materialApi.upload({ file, folder: 'fonts' }, () => {})
    const url = res?.url || res?.data?.url
    if (!url) throw new Error(t('admin.msg.fontUrlMissing'))
    fontDialog.form.woff = url
    fontDialog.form.woff_size = file.size
    ElMessage.success(t('admin.msg.fontUploaded'))
  } catch (e: any) {
    ElMessage.error(e?.message || t('admin.msg.fontUploadFailed'))
  } finally {
    fontDialog.submitting = false
    input.value = ''
  }
}

/** 接口返回 401 时按后端的 reason 字段区分「登录失效」与「无管理员权限」，不依赖提示文案 */
function denyByReason(res: any) {
  deny(res?.reason === 'forbidden' ? t('admin.auth.noPermission') : t('admin.auth.sessionExpired'))
}

/** 无权限 / 登录失效时清掉本地凭据并回首页 */
function deny(msg: string) {
  ElMessage.warning(msg)
  localStorage.removeItem(LocalStorageKey.tokenKey)
  localStorage.removeItem('xp_user')
  setTimeout(() => (window.location.href = './'), 800)
}

/** 主动退出登录（与 Index.vue 的 logout 行为一致） */
function onLogout() {
  localStorage.removeItem('xp_user')
  localStorage.removeItem(LocalStorageKey.tokenKey)
  window.location.href = './'
}

/** 读取本地登录用户；同时刷新侧边栏展示的账号信息 */
function readLocalUser(): TAdminUser | null {
  try {
    const user = JSON.parse(localStorage.getItem('xp_user') || 'null')
    if (user && typeof user.account === 'string' && user.role === 1) return { account: user.account, role: user.role }
  } catch (e) {}
  return null
}

/** 前端仅做入口守卫（读本地用户信息），真正的权限由后端 requireAdmin 校验 */
function checkLocalRole(): boolean {
  const user = readLocalUser()
  if (!user) return false
  adminUser.account = user.account
  adminUser.role = user.role
  return true
}

onMounted(() => {
  if (!checkLocalRole()) {
    deny(t('admin.auth.adminRequired'))
    return
  }
  loadTab()
})

/** 切换导航页：重置分页后拉取该页数据 */
function onSelectTab(key: string) {
  if (activeTab.value === key) return
  activeTab.value = key
  adminPage.value = 1
  loadTab()
}

/** 搜索类操作回到第一页，避免停留在第 2 页时搜不到结果 */
function reloadFromPage1() {
  adminPage.value = 1
  loadTab()
}

/** 总览页统计：模板/组件按 type 拆分计数，其余直接取接口 total */
async function loadOverview() {
  loading.value = true
  try {
    // 接口成功时拦截器只回 result 本体，非 200 时回完整对象，故统一按 any 接收
    const [tplRes, imgRes, fontRes]: any[] = await Promise.all([
      adminApi.getTemplates({ page: 1, pageSize: 100 }),
      adminApi.getUserImages({ page: 1, pageSize: 1 }),
      adminApi.getFonts({ page: 1, pageSize: 1 }),
    ])
    const tplList: any[] = Array.isArray(tplRes?.list) ? tplRes.list : []
    overview.templates = tplList.filter((item) => Number(item.type) === 0).length
    overview.components = tplList.filter((item) => Number(item.type) === 1).length
    overview.userImages = Number(imgRes?.total) || 0
    overview.fonts = Number(fontRes?.total) || 0
    if (tplRes?.code === 401) denyByReason(tplRes)
  } catch (e: any) {
    ElMessage.error(t('admin.msg.loadFailed'))
  } finally {
    loading.value = false
  }
}

/** 拉取当前导航页数据；接口返回 401（HTTP 200 + code 401）时回首页 */
async function loadTab() {
  if (!checkLocalRole()) return
  if (activeTab.value === 'overview') return loadOverview()
  loading.value = true
  try {
    let res: any
    adminTotal.value = 0
    if (activeTab.value === 'templates') {
      res = await adminApi.getTemplates({ page: adminPage.value, pageSize: adminPageSize.value })
      templates.value = res?.list || []
    } else if (activeTab.value === 'user-images') {
      res = await adminApi.getUserImages({ page: adminPage.value, pageSize: adminPageSize.value })
      userImages.value = res?.list || []
    } else if (activeTab.value === 'users') {
      res = await adminApi.getUsers({ page: adminPage.value, pageSize: adminPageSize.value })
      users.value = res?.list || []
    } else if (activeTab.value === 'designs') {
      res = await adminApi.getDesigns({ page: adminPage.value, pageSize: adminPageSize.value })
      designs.value = res?.list || []
    } else if (activeTab.value === 'categories') {
      if (categoryTab.value === 'template-categories') res = await adminApi.getTemplateCategories(templateCategoryType.value, { page: adminPage.value, pageSize: adminPageSize.value })
      else res = await adminApi.getCategories(categoryTab.value as 'materials' | 'photos', { page: adminPage.value, pageSize: adminPageSize.value })
      if (categoryTab.value === 'template-categories') templateCategories.value = res?.list || []
      else if (categoryTab.value === 'materials') materialCates.value = res?.list || []
      else photoCates.value = res?.list || []
    } else if (activeTab.value === 'materials') {
      res = await adminApi.getAssets('materials', { ...assetQuery, page: adminPage.value, pageSize: adminPageSize.value }); materialAssets.value = res?.list || []
    } else if (activeTab.value === 'photos') {
      res = await adminApi.getAssets('photos', { ...assetQuery, page: adminPage.value, pageSize: adminPageSize.value }); photoAssets.value = res?.list || []
    } else if (activeTab.value === 'fonts') {
      res = await adminApi.getFonts(fontQuery)
      fonts.value = res?.list || []
      fontQuery.total = Number(res?.total) || 0
    } else if (activeTab.value === 'ai-settings') {
      res = await adminApi.getAiSettings()
      Object.assign(aiForm, res || {})
    }
    if (activeTab.value !== 'fonts') adminTotal.value = Number(res?.total) || 0
    if (res?.code === 401) denyByReason(res)
  } catch (e: any) {
    ElMessage.error(t('admin.msg.loadFailed'))
  } finally {
    loading.value = false
  }
}

function jump2home() {
  window.location.href = './'
}

/** 在新窗口打开 PSD 导入页；type=1 表示创建组合（组件） */
function openPSDImport(type?: number) {
  const path = type === 1 ? '/psd?type=1' : '/psd'
  window.open(router.resolve(path).href, '_blank')
}

function onEditTemplate(row: any) {
  const href = router.resolve({ path: '/home', query: { tempid: String(row.id), tempType: String(row.type || 0), edit: '1' } }).href
  window.open(href, '_blank')
}

async function openCategoryEditor(row: any) {
  const type = Number(row.type) === 1 ? 1 : 0
  const res: any = await adminApi.getTemplateCategories(type, { page: 1, pageSize: 100 })
  categoryOptions.value = Array.isArray(res?.list) ? res.list : []
  categoryDialog.row = row
  categoryDialog.cate = row.cate || ''
  categoryDialog.visible = true
}

async function saveCategory() {
  const row = categoryDialog.row
  if (!row) return
  categoryDialog.submitting = true
  try {
    const res: any = await adminApi.updateTemplateCategory({ id: row.id, type: Number(row.type) === 1 ? 1 : 0, cate: categoryDialog.cate || '' })
    // 本弹窗只用于编辑，后端成功时返回 { code: 200 }（编辑无 result）。
    // 不再借 fontDialog.form.id 区分新增/编辑——那是字体弹窗的残留状态，与本行无关。
    if (res?.code === 200 || Number(res?.id) > 0) {
      row.cate = categoryDialog.cate || ''
      categoryDialog.visible = false
      ElMessage.success(t('admin.msg.categoryUpdated'))
    } else ElMessage.error(res?.msg || t('admin.msg.updateFailed'))
  } finally { categoryDialog.submitting = false }
}

async function onDelTemplate(row: any) {
  try {
    await ElMessageBox.confirm(t('admin.confirm.unpublish', { name: row.title || row.id }), t('admin.msg.notice'), { type: 'warning' })
    const res: any = await adminApi.deleteTemplate(row.id)
    if (res?.code === 200) { ElMessage.success(t('admin.msg.unpublished')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.opFailed'))
  } catch (error) {
    // 忽略取消操作。
  }
}

async function onRemoveTemplate(row: any) {
  try {
    await ElMessageBox.confirm(t('admin.confirm.deletePermanent', { name: row.title || row.id }), t('admin.msg.danger'), { type: 'warning' })
    const res: any = await adminApi.removeTemplate(row.id)
    if (res?.code === 200) { ElMessage.success(t('admin.msg.deleted')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.deleteFailed'))
  } catch (error) {
    // 忽略取消操作。
  }
}

async function onDelUserImage(row: any) {
  await ElMessageBox.confirm(t('admin.msg.confirmDeleteImageRecord'), t('admin.msg.notice'), { type: 'warning' })
  const res: any = await adminApi.deleteUserImage(row.id)
  if (res?.code === 200) {
    ElMessage.success(t('admin.msg.deleted'))
    loadTab()
  } else {
    ElMessage.error(res?.msg || t('admin.msg.opFailed'))
  }
}

async function onDelUser(row: adminApi.TAdminUserItem) {
  await ElMessageBox.confirm(t('admin.confirm.deleteUser', { name: row.account }), t('admin.msg.danger'), { type: 'warning' })
  const res: any = await adminApi.deleteUser(row.id)
  if (res?.code === 200) {
    ElMessage.success(t('admin.msg.userDeleted'))
    loadTab()
  } else {
    ElMessage.error(res?.msg || t('admin.msg.deleteFailed'))
  }
}

async function onDelDesign(row: adminApi.TAdminDesignItem) {
  await ElMessageBox.confirm(t('admin.confirm.deleteDesign', { account: row.account, name: row.title || row.id }), t('admin.msg.danger'), { type: 'warning' })
  const res: any = await adminApi.deleteDesign(row.id)
  if (res?.code === 200) { ElMessage.success(t('admin.msg.designDeleted')); loadTab() } else ElMessage.error(res?.msg || t('admin.msg.deleteFailed'))
}

async function onDelCategory(type: 'materials' | 'photos', row: any) {
  try {
    await ElMessageBox.confirm(t('admin.confirm.deleteCategory', { name: row.name || row.cate }), t('admin.msg.notice'), { type: 'warning' })
    const res: any = await adminApi.deleteCategory(type, row.cate)
    if (res?.code === 200) { ElMessage.success(t('admin.msg.deleted')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.opFailed'))
  } catch (error) {
    // 用户取消确认时，Element Plus 会 reject Promise，这不是业务错误。
  }
}

async function onAddCategory(type: 'materials' | 'photos') {
  try {
    const result = await ElMessageBox.prompt(t('admin.msg.enterCategoryName'), t('admin.v.addCategory'), { inputValidator: (value) => value.trim() ? true : t('admin.msg.categoryNameEmpty') })
    const res: any = await adminApi.addCategory(type, result.value.trim())
    if (res?.code === 200) { ElMessage.success(t('admin.msg.categoryCreated')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.categoryCreateFailed'))
  } catch (error) {
    // 忽略取消操作，避免触发 Vue 的 unhandled component event handler。
  }
}

async function onRenameCategory(type: 'materials' | 'photos', row: any) {
  try {
    const result = await ElMessageBox.prompt(t('admin.msg.enterNewCategoryName'), t('admin.msg.renameCategory'), { inputValue: row.name || row.cate, inputValidator: (value) => value.trim() ? true : t('admin.msg.categoryNameEmpty') })
    const res: any = await adminApi.renameCategory(type, row.cate, result.value.trim())
    if (res?.code === 200) { ElMessage.success(t('admin.msg.categoryRenamed')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.categoryRenameFailed'))
  } catch (error) {
    // 忽略取消操作。
  }
}

async function addTemplateCategory() {
  if (!newTemplateCategory.name.trim()) return ElMessage.warning(t('admin.msg.categoryNameRequired'))
  const res: any = await adminApi.addTemplateCategory({ ...newTemplateCategory, type: templateCategoryType.value })
  if (res?.id) {
    newTemplateCategory.name = ''
    ElMessage.success(t('admin.msg.categoryAdded'))
    loadTab()
  } else ElMessage.error(res?.msg || t('admin.msg.createFailed'))
}

async function onDelTemplateCategory(row: any) {
  try {
    await ElMessageBox.confirm(t('admin.confirm.deleteTplCategory', { name: row.name }), t('admin.msg.notice'), { type: 'warning' })
    const res: any = await adminApi.deleteTemplateCategory(row.id)
    res?.code === 200 ? (ElMessage.success(t('admin.msg.categoryDeleted')), await loadTab()) : ElMessage.error(res?.msg || t('admin.msg.deleteFailed'))
  } catch (error) {
    // 忽略取消操作。
  }
}

async function onRenameTemplateCategory(row: any) {
  try {
    const result = await ElMessageBox.prompt(t('admin.msg.enterNewCategoryName'), t('admin.msg.renameCategory'), { inputValue: row.name, inputValidator: (value) => value.trim() ? true : t('admin.msg.categoryNameEmpty') })
    const res: any = await adminApi.renameTemplateCategory({ id: row.id, name: result.value.trim() })
    if (res?.code === 200) { ElMessage.success(t('admin.msg.categoryRenamed')); await loadTab() } else ElMessage.error(res?.msg || t('admin.msg.renameFailed'))
  } catch (error) {
    // 忽略取消操作。
  }
}

/** 提交新增字体：先过前端表单校验，再调接口 */
async function submitFont() {
  if (!fontFormRef.value) return
  try {
    await fontFormRef.value.validate()
  } catch (e) {
    return
  }
  fontDialog.submitting = true
  try {
    const data = {
      alias: fontDialog.form.alias.trim(),
      value: fontDialog.form.value.trim(),
      woff: fontDialog.form.woff.trim(),
      ttf: fontDialog.form.ttf.trim(),
      preview: fontDialog.form.preview.trim(),
      lang: fontDialog.form.lang,
      font_family: fontDialog.form.font_family.trim(),
      size: Number(fontDialog.form.size) || 0,
      woff_size: Number(fontDialog.form.woff_size) || 0,
    }
    const res: any = fontDialog.form.id
      ? await adminApi.updateFont({ ...data, id: fontDialog.form.id })
      : await adminApi.addFont(data)
    // 成功响应会被请求封装解包：新增返回 { id }，编辑无 result 时返回 { code: 200 }。
    if ((fontDialog.form.id && res?.code === 200) || (!fontDialog.form.id && Number(res?.id) > 0)) {
      ElMessage.success(fontDialog.form.id ? t('admin.msg.changed') : t('admin.msg.added'))
      fontDialog.visible = false
      // 清掉旧 localStorage 缓存（虽然当前 font store 已不再用 localStorage，但保留兜底清理）
      localStorage.removeItem('FONTS_VERSION')
      localStorage.removeItem('FONTS')
      await loadTab()
    } else {
      ElMessage.error(res?.msg || t('admin.msg.addFailed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.message || t('admin.msg.addFailed'))
  } finally {
    fontDialog.submitting = false
  }
}

async function onDelFont(row: adminApi.TAdminFontItem) {
  await ElMessageBox.confirm(t('admin.confirm.deleteFont', { name: row.alias || row.value || row.id }), t('admin.msg.notice'), { type: 'warning' })
  const res: any = await adminApi.deleteFont(row.id)
  if (res?.code === 200) {
    ElMessage.success(t('admin.msg.deleted'))
    localStorage.removeItem('FONTS_VERSION')
    localStorage.removeItem('FONTS')
    loadTab()
  } else {
    ElMessage.error(res?.msg || t('admin.msg.opFailed'))
  }
}

/** 保存 AI 配置：空密钥视为保留原值不清空（仅管理员可调用） */
async function saveAiSettings() {
  aiSaving.value = true
  try {
    const res: any = await adminApi.updateAiSettings({
      base_url: aiForm.base_url.trim(),
      api_key: aiForm.api_key.trim() || undefined,
      text_model: aiForm.text_model.trim(),
      image_model: aiForm.image_model.trim(),
      image_size_mode: aiForm.image_size_mode,
      enabled: aiForm.enabled,
    })
    if (res?.code === 200) {
      ElMessage.success(t('admin.msg.aiSaved'))
      await loadTab()
    } else {
      ElMessage.error(res?.msg || t('admin.msg.saveFailed'))
    }
  } catch (e: any) {
    ElMessage.error(e?.message || t('admin.msg.saveFailed'))
  } finally {
    aiSaving.value = false
  }
}

/** 测试智谱连接：复用后台配置实际调一次 */
async function testAiConnection() {
  aiTesting.value = true
  try {
    const res: any = await adminApi.testAiConnection()
    // 成功响应会被请求封装解包为 { content }（无 code），失败则为 { code: 400, msg }
    if (res && typeof res.content === 'string') ElMessage.success(t('admin.msg.connected'))
    else ElMessage.error(res?.msg || t('admin.msg.connectFailed'))
  } catch (e: any) {
    ElMessage.error(e?.message || t('admin.msg.connectFailed'))
  } finally {
    aiTesting.value = false
  }
}
</script>

<style lang="less" scoped>
/* ── 骨架：左侧导航 + 右侧（顶栏 + 可滚动内容区）────────────────────── */
.admin-shell {
  display: flex;
  height: 100vh;
  background: @color-canvas-page;
  color: @color-ink;
  overflow: hidden;
}
.admin-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.admin-body {
  flex: 1;
  min-height: 0;
  padding: 24px 28px 28px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* ── 白色内容托盘 ───────────────────────────────────────────────────── */
.pane {
  padding: 20px 22px;
  background: @color-canvas;
  border: 1px solid @color-hairline;
  border-radius: @radius-md;
  box-sizing: border-box;
  + .pane {
    margin-top: 16px;
  }
}
.pane-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: @color-ink-strong;
}
.pane-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  .toolbar-spacer { flex: 1; }
  .toolbar-note {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: @color-ink-muted;
  }
  .search-input { width: 260px; }
  .name-input { width: 200px; }
}

/* ── 总览页 ─────────────────────────────────────────────────────────── */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

/* ── 表格统一样式（:deep 覆盖到 AdminTemplateTable 内部的表头）───────── */
.pane :deep(th.el-table__cell) {
  padding: 11px 0;
  background: @color-canvas-page;
  color: @color-ink-muted;
  font-weight: 600;
  font-size: 13px;
}
.pane :deep(td.el-table__cell) {
  padding: 9px 0;
  font-size: 13px;
}
.pane :deep(.el-table__empty-block) {
  min-height: 120px;
}

/* ── 通用文字 ───────────────────────────────────────────────────────── */
.muted-text {
  font-size: 12px;
  color: @color-ink-hint;
}
.link-primary {
  color: @color-primary;
  text-decoration: none;
  &:hover { color: @color-primary-hover; }
}

/* ── AI 设置表单 ────────────────────────────────────────────────────── */
.ai-form {
  max-width: 560px;
  margin-top: 4px;
}

/* ── 分页 ───────────────────────────────────────────────────────────── */
.admin-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 900px) {
  .admin-body { padding: 16px; }
  .overview-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .quick-actions { grid-template-columns: 1fr; }
  .pane-toolbar {
    flex-wrap: wrap;
    .toolbar-spacer { display: none; }
  }
}
</style>
